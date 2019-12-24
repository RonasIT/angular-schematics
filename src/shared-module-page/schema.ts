export interface Schema {
  name: string;
  type: 'component' | 'directive' | 'pipe' | 'service';
  intoSection: boolean;
  intoPage: boolean;
  intoParentPage: boolean;
  component: string;
  directive: string;
  pipe: string;
  service: string;
  section: string;
  parentPage: string;
  page: string;
  flat: boolean;
  path: string;
}
