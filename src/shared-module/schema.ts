export interface Schema {
  name: string;
  type: 'component' | 'directive' | 'pipe' | 'service';
  component: string;
  directive: string;
  pipe: string;
  service: string;
  section: string;
  path: string;
}
