export type PermissionCheck = (...perms: string[]) => boolean;

export const hasPermission = (
  required: string[],
  actual: string[]
): boolean => {
  return required.every((perm) => actual.includes(perm));
};
