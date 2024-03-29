// Edited version of
// https://github.com/manishsaraan/email-validator/blob/master/index.js

const testers: RegExp[] = [
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/,
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})/,
];

export const EmailValidator = (email: string): boolean => {
  if (!email) return false;

  const emailParts = email.split('@');

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  if (emailParts.length !== 2) return false;

  const account = emailParts[0]!;
  const address = emailParts[1]!;
  const domainParts = address.split('.');
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  if (account.length > 64) return false;
  if (address.length > 255) return false;

  if (domainParts.some((part) => part.length > 63)) return false;

  return testers.every((tester) => tester.test(email));
};
