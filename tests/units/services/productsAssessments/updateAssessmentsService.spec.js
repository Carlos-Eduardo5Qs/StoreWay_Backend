const UpdateAssessemts = require('../../../../src/services/productsAssessments/UpdateAssessmentsService');
const UpdateAssessemtsModel = require('../../../../src/models/productsAssessments/UpdateAssessmentsModel');
const FindUserModel = require('../../../../src/models/users/FindUserModel');
const FindAssessmentModel = require('../../../../src/models/productsAssessments/FindAssessmentModel');

// Mock dos modelos
jest.mock('../../../../src/models/productsAssessments/UpdateAssessmentsModel');
jest.mock('../../../../src/models/users/FindUserModel');
jest.mock('../../../../src/models/productsAssessments/FindAssessmentModel');

describe('UpdateAssessemts Service', () => {
    const mockAssessmentId = 1;
    const mockReview = 'Updated review';
    const mockStars = 5;
    const mockUserId = 101;

    let updateAssessemts;

    beforeEach(() => {
        updateAssessemts = new UpdateAssessemts(mockAssessmentId, mockReview, mockStars, mockUserId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update assessment if user is authorized', async () => {
        // Mock do usuário encontrado
        const mockUser = { id: mockUserId };
        FindUserModel.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockUser),
        }));

        // Mock da avaliação encontrada
        const mockAssessment = { user_id: mockUserId };
        FindAssessmentModel.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockAssessment),
        }));

        // Criar mock do modelo UpdateAssessemtsModel
        const mockUpdateInstance = {
            update: jest.fn().mockResolvedValue(),
        };
        UpdateAssessemtsModel.mockImplementation(() => mockUpdateInstance);

        // Chama o método checkUser
        await updateAssessemts.checkUser();

        // Verifica se a atualização foi chamada
        expect(mockUpdateInstance.update).toHaveBeenCalled();
    });

    it('should return "Access denied." if user is not authorized', async () => {
        // Mock do usuário encontrado
        const mockUser = { id: mockUserId };
        FindUserModel.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockUser),
        }));

        // Mock da avaliação encontrada (dono diferente)
        const mockAssessment = { user_id: 999 }; // ID diferente do mockUserId
        FindAssessmentModel.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockAssessment),
        }));

        // Chama o método checkUser e verifica o retorno
        const result = await updateAssessemts.checkUser();
        expect(result).toBe('Access denied.');

        // Verifica que a atualização não foi chamada
        expect(UpdateAssessemtsModel).not.toHaveBeenCalled();
    });
});
