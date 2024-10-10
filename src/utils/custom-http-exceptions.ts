import { HttpException } from '@nestjs/common';

export const CUSTOM_HTTP_EXCEPTIONS = {
    400: new HttpException('Internal server error', 400),
    499: new HttpException('Force to login screen. (delete jwt on local)', 499),
    410: new HttpException('Not enough point to execute service.', 410),
    411: new HttpException('Email does not exist.', 411),
    412: new HttpException('Incorrect password.', 412),
    413: new HttpException('Email has been used by another account.', 413),
    414: new HttpException('Invalid Invite code.', 414),
    415: new HttpException('Invalid Code.', 415),
    416: new HttpException('New password must not equal old password.', 416),
    417: new HttpException('Can not referral your self.', 417),
    418: new HttpException('Confirm password not equal to password.', 418),
    419: new HttpException('Can not change inviter.', 419),
    420: new HttpException('Can not upload image.', 420),
    421: new HttpException('Can not translate.', 421),
    422: new HttpException(
        'Unable to provide a concise summary as no information is given.',
        422,
    ),
    423: new HttpException('Reach limit.', 423),
    424: new HttpException('Invalid file extension.', 424),
    425: new HttpException('Reach file size limit.', 425),
    426: new HttpException('File not found.', 426),
    427: new HttpException('File is deleted.', 427),
};

export const PARSED_STRING_HTTP_EXCEPTIONS = `
${Object.entries(CUSTOM_HTTP_EXCEPTIONS).reduce((acc, cur) => {
    return (acc += `
  \n${cur[0]}: ${cur[1].message}
  `);
}, '')}
`;
