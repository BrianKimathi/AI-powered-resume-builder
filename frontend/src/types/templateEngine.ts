// CANONICAL TEMPLATE AST & DESIGN TOKEN SCHEMA SPECIFICATION

export interface PageSettings {
  format: 'A4' | 'LETTER';
  orientation: 'PORTRAIT' | 'LANDSCAPE';
  margins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
}

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textPrimary: string;
    textMuted: string;
    border: string;
  };
  typography: {
    fontFamilyHeader: string;
    fontFamilyBody: string;
    scaleRatio: number;
    baseFontSize: string;
    lineHeightBase: number;
    lineHeightHeader: number;
  };
  spacing: {
    unit: string;
    sectionGap: string;
    itemGap: string;
    containerPadding: string;
  };
  borders: {
    radius: string;
    width: string;
  };
}

export type ComponentCategory = 'LAYOUT' | 'CONTENT' | 'DECORATIVE';

export interface LayoutProperties {
  display: 'flex' | 'grid' | 'block';
  flexDirection?: 'row' | 'column';
  gridColumns?: string;
  gap?: string;
  width?: string;
  height?: string;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'space-between' | 'flex-end';
}

export interface StyleProperties {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'uppercase' | 'capitalize' | 'none';
  borderBottom?: string;
  padding?: string;
  margin?: string;
}

export interface PaginationRules {
  allowPageBreakInside: boolean;
  keepWithNext: boolean;
  keepTogether: boolean;
  minRemainingHeight?: string;
}

export interface ComponentNode {
  id: string;
  type: string; // 'Container' | 'HeaderComponent' | 'SummaryComponent' | 'SkillsComponent' | 'ExperienceList' | 'EducationList' | 'ProjectsList'
  category: ComponentCategory;
  name: string;
  layoutProps: LayoutProperties;
  styleProps: StyleProperties;
  paginationProps: PaginationRules;
  binding?: string;
  condition?: string;
  children?: ComponentNode[];
  content?: string;
}

export interface TemplateAST {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  version: number;
  pageSettings: PageSettings;
  themeTokens: ThemeTokens;
  rootContainer: ComponentNode;
}

// ATOMIC COMMAND OPERATIONS SPECIFICATION
export type OperationType =
  | 'SET_THEME_TOKEN'
  | 'UPDATE_PAGE_SETTINGS'
  | 'INSERT_COMPONENT'
  | 'MOVE_COMPONENT'
  | 'REMOVE_COMPONENT'
  | 'UPDATE_COMPONENT_STYLE'
  | 'UPDATE_COMPONENT_LAYOUT'
  | 'UPDATE_DATA_BINDING';

export interface CommandOperation {
  op: OperationType;
  targetId?: string;
  path?: string;
  value?: any;
  parentId?: string;
  index?: number;
}

export interface OperationTransaction {
  transactionId: string;
  timestamp: string;
  author: 'AI_AGENT' | 'HUMAN_ADMIN';
  description: string;
  operations: CommandOperation[];
}
