import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';
import { useLogin } from '../../hooks/authentication/use-login';
import { useYouTubeLogin } from '../../hooks/authentication/use-youtube-login';
import { useRouter } from 'next/router';

jest.mock('../../hooks/authentication/use-login');
jest.mock('../../hooks/authentication/use-youtube-login');
jest.mock('next/router');

const mockUseLogin = useLogin as jest.Mock;
const mockUseYouTubeLogin = useYouTubeLogin as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('<Login />', () => {
  afterEach(() => {
    mockUseLogin.mockReset();
    mockUseYouTubeLogin.mockReset();
    mockUseRouter.mockReset();
  });

  it('should mount', () => {
    render(<Login />);

    const login = screen.getByTestId('Login');

    expect(login).toBeInTheDocument();
  });

  describe('on login click', () => {
    let mockYouTubeLogin: jest.Mock;
    let mockLogin: jest.Mock;

    beforeEach(() => {
      mockYouTubeLogin = jest.fn();
      mockUseYouTubeLogin.mockReturnValue(mockYouTubeLogin);

      mockLogin = jest.fn();
      mockUseLogin.mockReturnValue(mockLogin);
    });

    describe('with successful login', () => {
      let mockRouterPush: jest.Mock;

      let accessToken: string;

      beforeEach(async () => {
        mockRouterPush = jest.fn();
        mockUseRouter.mockReturnValue({ push: mockRouterPush });

        accessToken = '123';
        mockYouTubeLogin.mockReturnValue(accessToken);

        render(<Login />);

        const loginButton = screen.getByTestId('YouTubeLoginButton');
        loginButton.click();
      });

      it('should login with YouTube access token', () => {
        expect(mockLogin).toBeCalledWith(accessToken);
      });

      it('should redirect to home page', () => {
        expect(mockRouterPush).toBeCalledWith('/');
      });
    });

    describe('with failed login', () => {
      beforeEach(async () => {
        mockLogin.mockImplementation(() => {
          throw new Error();
        });

        render(<Login />);
        const loginButton = screen.getByTestId('YouTubeLoginButton');
        loginButton.click();

        await waitForElementToBeRemoved(() =>
          screen.queryByTestId('LoadingSpinner')
        );
      });

      it('should display error message', () => {
        const errorMessage = screen.getByTestId('LoginErrorMessage');

        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
