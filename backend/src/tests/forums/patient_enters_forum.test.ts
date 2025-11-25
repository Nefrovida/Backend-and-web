import request from 'supertest';
import express from 'express';
import forumRouter from '../../routes/forums.routes';
import * as forumsService from '../../service/forums.service';
import { authenticate } from '../../middleware/auth.middleware';
import { requirePrivileges } from '../../middleware/rbac.middleware';

// Mock dependencies
jest.mock('../../service/forums.service');
jest.mock('../../middleware/auth.middleware');
jest.mock('../../middleware/rbac.middleware', () => ({
    requirePrivileges: jest.fn(() => (req: any, res: any, next: any) => next())
}));

const app = express();
app.use(express.json());
app.use('/api/forums', forumRouter);

describe('Patient Enters Forum Use Case', () => {
    const mockUser = {
        userId: 'patient-123',
        role: 'PATIENT',
        email: 'patient@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock authentication to always succeed and return the mock user
        (authenticate as jest.Mock).mockImplementation((req, res, next) => {
            req.user = mockUser;
            next();
        });
    });

    describe('GET /api/forums/:forumId', () => {
        it('should successfully retrieve forum details when patient enters', async () => {
            const mockForum = {
                forum_id: 1,
                name: 'General Health',
                description: 'General health discussions',
                public_status: true,
                created_by: 'admin-1',
                active: true,
                creation_date: new Date().toISOString()
            };

            (forumsService.getForumById as jest.Mock).mockResolvedValue(mockForum);

            const response = await request(app).get('/api/forums/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockForum);
            expect(forumsService.getForumById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if forum does not exist', async () => {
            (forumsService.getForumById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/forums/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Foro no encontrado');
        });
    });

    describe('GET /api/forums/:forumId/messages', () => {
        it('should successfully retrieve forum messages', async () => {
            const mockMessages = {
                data: [
                    {
                        message_id: 101,
                        content: 'Hello everyone',
                        user_id: 'user-2',
                        forum_id: 1,
                        created_at: new Date().toISOString()
                    }
                ],
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    totalRecords: 1,
                    totalPages: 1
                }
            };

            (forumsService.getForumMessages as jest.Mock).mockResolvedValue(mockMessages);

            const response = await request(app).get('/api/forums/1/messages');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMessages);
            expect(forumsService.getForumMessages).toHaveBeenCalledWith(1, 'patient-123', 1, 20);
        });
    });
});
