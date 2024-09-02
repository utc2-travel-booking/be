import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';
import { PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';
import { ExcludeDto } from 'src/base/dto/exclude.dto';

export class PermissionDto {
    name: string;
    admin: RolePermissionsDto;
    front: RolePermissionsDto;
    [key: string]: any;
}

interface RolePermissionsDto {
    index: boolean;
    create: boolean;
    edit: boolean;
    destroy: boolean;
}

export class CreateRoleDto extends PartialType(ExcludeDto) {
    @ExtendedApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ExtendedApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(100)
    type: number;

    @ExtendedApiProperty({
        type: [PermissionDto],
    })
    @IsNotEmpty()
    @IsArray()
    permissions: PermissionDto[];
}
