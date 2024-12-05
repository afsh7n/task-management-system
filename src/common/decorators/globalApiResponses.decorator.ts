import {applyDecorators, UnauthorizedException} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {ServiceUnavailableException} from "@nestjs/common/exceptions/service-unavailable.exception";
import {ErrorResponseDto} from "../dto/errorResponse.dto";

export function GlobalApiResponses() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            description: 'Unauthorized access, invalid token.',
            type: ErrorResponseDto,
        }),

        ApiResponse({
            status: 401,
            description: 'Unauthorized access, invalid token.',
            type: ErrorResponseDto,
        }),
        ApiResponse({
            status: 500,
            description: 'Internal server error.',
            type: ServiceUnavailableException,
        }),
    );
}
