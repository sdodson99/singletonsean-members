import { Router as createRouter } from 'express';
import { SaveMessageCommand } from '../commands/save-message';
import { DatabasePaths } from '../configuration/database-paths';
import { authenticate } from '../middleware/authenticate';
import { MessageByMemberIdQuery } from '../queries/message-by-member-id';
import { getFirebaseApp } from '../startup/firebase-app';

const firebaseApp = getFirebaseApp();
const messagesPath = DatabasePaths.MESSAGES;
const messageByMemberIdQuery = new MessageByMemberIdQuery(
  firebaseApp,
  messagesPath
);
const saveMessageCommand = new SaveMessageCommand(firebaseApp, messagesPath);

export const createAccountRouter = () => {
  const router = createRouter();

  router.get('/message', authenticate, async (req, res) => {
    const memberId = req.user?.id;

    if (!memberId) {
      return res.sendStatus(401);
    }

    const message = await messageByMemberIdQuery.execute(memberId);

    const messageResponse = {
      content: message?.content ?? '',
    };

    return res.send(messageResponse);
  });

  router.put('/message', authenticate, async (req, res) => {
    const memberId = req.user?.id;

    if (!memberId) {
      return res.sendStatus(401);
    }

    const { content } = req.body;
    const message = {
      content,
    };

    await saveMessageCommand.execute(memberId, message);

    return res.sendStatus(204);
  });

  return router;
};