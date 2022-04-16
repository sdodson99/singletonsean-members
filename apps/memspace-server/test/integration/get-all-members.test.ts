import supertest from 'supertest';
import test from 'firebase-functions-test';
import * as firebase from 'firebase-admin';
import { MessageByMemberIdQuery } from '../../src/queries/message-by-member-id';
import { YouTubeMembersQuery } from 'youtube-member-querier';

const functionsTest = test();
functionsTest.mockConfig({ youtube_studio: {}, access_token: {} });

jest.mock('firebase-admin', () => ({
  ...jest.requireActual<{}>('firebase-admin'),
  initializeApp: jest.fn(),
}));
const mockFirebaseInitializeApp = firebase.initializeApp as jest.Mock;

jest.mock('../../src/queries/message-by-member-id');
const mockMessageByMemberIdQuery = MessageByMemberIdQuery as jest.Mock;

jest.mock('youtube-member-querier');
const mockYouTubeMembersQuery = YouTubeMembersQuery as jest.Mock;

describe('/members endpoint', () => {
  let app: any;

  let mockYouTubeMembersQueryExecute: jest.Mock;
  let mockMessageByMemberIdQueryExecute: jest.Mock;

  beforeAll(() => {
    mockYouTubeMembersQueryExecute = jest.fn();
    mockYouTubeMembersQuery.mockReturnValue({
      execute: mockYouTubeMembersQueryExecute,
    });

    mockMessageByMemberIdQueryExecute = jest.fn();
    mockMessageByMemberIdQuery.mockReturnValue({
      execute: mockMessageByMemberIdQueryExecute,
    });

    app = require('../../src/index').memspaceApi;
  });

  afterEach(() => {
    mockFirebaseInitializeApp.mockReset();
    mockMessageByMemberIdQuery.mockReset();
    mockYouTubeMembersQuery.mockReset();

    functionsTest.cleanup();
  });

  it('should return members with messages when successful', async () => {
    mockYouTubeMembersQueryExecute.mockReturnValue([
      { channelId: '1' },
      { channelId: '2' },
    ]);
    mockMessageByMemberIdQueryExecute.mockImplementation(async (memberId) => ({
      content: `${memberId}-message`,
    }));

    const { statusCode, body } = await supertest(app).get('/members');

    expect(statusCode).toBe(200);
    expect(body).toEqual([
      { id: '1', message: '1-message' },
      { id: '2', message: '2-message' },
    ]);
  });

  it('should return members with empty message for members that do not have messages yet', async () => {
    mockYouTubeMembersQueryExecute.mockReturnValue([
      { channelId: '1' },
      { channelId: '2' },
    ]);
    mockMessageByMemberIdQueryExecute.mockResolvedValue(null);

    const { statusCode, body } = await supertest(app).get('/members');

    expect(statusCode).toBe(200);
    expect(body).toEqual([
      { id: '1', message: '' },
      { id: '2', message: '' },
    ]);
  });
});