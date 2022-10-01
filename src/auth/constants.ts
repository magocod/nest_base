export const PASSWORD_PATTERN =
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// export enum PermissionIds {
//   EXAMPLE,
// }

export enum PermissionNames {
  EXAMPLE = 'example',
  USER = 'user',
}

// default in db
export enum RoleNames {
  SUPER_USER = 'superuser',
  ADMIN = 'admin',
  USER = 'user',
}
