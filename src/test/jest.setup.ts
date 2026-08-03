jest.mock('graphql-upload/GraphQLUpload.mjs', () => ({
  __esModule: true,
  default: class GraphQLUpload {},
}));

jest.mock('graphql-upload/Upload.mjs', () => ({
  __esModule: true,
  default: class Upload {},
}));

jest.mock('@/src/core/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('@/src/generated/prisma/client', () => ({}));

jest.mock('@/src/generated/prisma/enums', () => ({
  TokenType: {
    EMAIL_VERIFY: 'EMAIL_VERIFY',
    PASSWORD_RESET: 'PASSWORD_RESET',
    DEACTIVATE_ACCOUNT: 'DEACTIVATE_ACCOUNT',
  },
}));

jest.mock('@prisma/generated/client', () => ({}));
jest.mock('@prisma/generated/enums', () => ({
  TokenType: {
    EMAIL_VERIFY: 'EMAIL_VERIFY',
    PASSWORD_RESET: 'PASSWORD_RESET',
    DEACTIVATE_ACCOUNT: 'DEACTIVATE_ACCOUNT',
  },
}));

jest.mock('@/src/shared/guards/gql-auth.guard', () => ({
  GqlAuthGuard: class GqlAuthGuard {
    canActivate = jest.fn().mockResolvedValue(true);
  },
}));
