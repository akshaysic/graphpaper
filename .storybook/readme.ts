// Component READMEs open with "# Name"; the docs page already shows the name as its title.
export function readmeDescription(readme: string): string {
  return readme.replace(/^# .*\n+/, '');
}
