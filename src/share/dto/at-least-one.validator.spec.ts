import { validate } from 'class-validator';
import { ShareCreateDTO } from './share-create.dto';
import { ShareAccess } from '../enums/share-access.enum';


describe('AtLeastOne decorator', () => {
    it('should pass validation when at least one field in each group is provided', async () => {
        const dto = new ShareCreateDTO();
        dto.fileId = 'file-123';
        dto.emails = ['user-1'];
        dto.access = ShareAccess.VIEW;

        const errors = await validate(dto);
        expect(errors.length).toBe(0); // No validation errors
    });

    it('should fail validation when none of the required fields are provided', async () => {
        const dto = new ShareCreateDTO();
        dto.access = ShareAccess.VIEW;

        const errors = await validate(dto);

        expect(errors.length).toBe(2);
        expect(errors[0].constraints).toHaveProperty(
            'AtLeastOne',
            'Provide either fileId or folderId',
        );
        expect(errors[1].constraints).toHaveProperty(
            'AtLeastOne',
            'Provide at least one recipient (userIds or teamIds)',
        );
    });

    it('should pass validation when folderId and teamIds are provided', async () => {
        const dto = new ShareCreateDTO();
        dto.folderId = 'folder-abc';
        dto.teamIds = ['team-1', 'team-2'];
        dto.access = ShareAccess.VIEW;

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation if fileId is provided but no recipient', async () => {
        const dto = new ShareCreateDTO();
        dto.fileId = 'file-123';
        dto.access = ShareAccess.VIEW;

        const errors = await validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toHaveProperty(
            'AtLeastOne',
            'Provide at least one recipient (userIds or teamIds)',
        );
    });
});
