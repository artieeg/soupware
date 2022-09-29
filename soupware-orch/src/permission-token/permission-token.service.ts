import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaPermission } from '@soupware/shared';
import { Optional } from 'utility-types';
import jwt, { JwtPayload } from 'jsonwebtoken';

type CreateTokenParams = Optional<MediaPermission, 'produce'>;
type UpdateTokenParams = Partial<MediaPermission>;

@Injectable()
export class PermissionTokenService {
  constructor(private configService: ConfigService) {}

  create(data: CreateTokenParams) {
    const secret = this.configService.get('SOUPWARE_JWT_SECRET');

    const token = jwt.sign(
      {
        produce: {
          audio: false,
          video: false,
        },
        ...data,
      },
      secret,
      {
        expiresIn: '1d',
      },
    );

    return token;
  }

  decode(token: string) {
    const secret = this.configService.get('SOUPWARE_JWT_SECRET');

    return jwt.verify(token, secret) as MediaPermission;
  }

  update(prevToken: string, updatedTokenData: UpdateTokenParams) {
    const secret = this.configService.get('SOUPWARE_JWT_SECRET');

    const token = jwt.sign(
      {
        ...(jwt.decode(prevToken) as JwtPayload),
        ...updatedTokenData,
      },
      secret,
      {
        expiresIn: '1d',
      },
    );

    return token;
  }
}
