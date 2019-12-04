export interface Schema {
  name: string;
  type: 'component' | 'directive' | 'service';
  component: string;
  directive: string;
  service: string;
  path: string;
}
