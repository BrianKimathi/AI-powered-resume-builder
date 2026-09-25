import { TemplateAST, ComponentNode, CommandOperation, OperationTransaction } from '../types/templateEngine';

// DEFAULT DESIGN TOKEN THEME SPECIFICATION
export const DEFAULT_THEME_TOKENS = {
  colors: {
    primary: '#0f172a',
    secondary: '#0284c7',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    textPrimary: '#1e293b',
    textMuted: '#475569',
    border: '#cbd5e1'
  },
  typography: {
    fontFamilyHeader: 'Inter',
    fontFamilyBody: 'Inter',
    scaleRatio: 1.2,
    baseFontSize: '10pt',
    lineHeightBase: 1.4,
    lineHeightHeader: 1.2
  },
  spacing: {
    unit: '4px',
    sectionGap: '16px',
    itemGap: '8px',
    containerPadding: '0px'
  },
  borders: {
    radius: '4px',
    width: '1px'
  }
};

// HELPER: FIND COMPONENT BY ID IN AST TREE
export function findComponentNode(root: ComponentNode, id: string): ComponentNode | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findComponentNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

// HELPER: REMOVE COMPONENT FROM PARENT IN AST TREE
export function removeComponentNode(root: ComponentNode, id: string): { root: ComponentNode; removed: ComponentNode | null } {
  const newRoot = JSON.parse(JSON.stringify(root)) as ComponentNode;
  let removed: ComponentNode | null = null;

  function traverse(node: ComponentNode): boolean {
    if (!node.children) return false;
    const index = node.children.findIndex(c => c.id === id);
    if (index !== -1) {
      removed = node.children.splice(index, 1)[0];
      return true;
    }
    return node.children.some(traverse);
  }

  traverse(newRoot);
  return { root: newRoot, removed };
}

// HELPER: INSERT COMPONENT INTO PARENT BY ID AND INDEX
export function insertComponentNode(root: ComponentNode, parentId: string, nodeToInsert: ComponentNode, index?: number): ComponentNode {
  const newRoot = JSON.parse(JSON.stringify(root)) as ComponentNode;
  const parent = findComponentNode(newRoot, parentId);
  if (!parent) return root;

  if (!parent.children) parent.children = [];
  const idx = index !== undefined && index >= 0 ? Math.min(index, parent.children.length) : parent.children.length;
  parent.children.splice(idx, 0, nodeToInsert);

  return newRoot;
}

// HELPER: SET NESTED VALUE BY DOT-NOTATION PATH (e.g. "colors.primary")
function setNestedPath(obj: any, path: string, value: any): any {
  const newObj = JSON.parse(JSON.stringify(obj));
  const parts = path.split('.');
  let curr = newObj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
  return newObj;
}

// ATOMIC COMMAND EXECUTION MUTATOR
export function applyCommandOperation(ast: TemplateAST, operation: CommandOperation): TemplateAST {
  const newAst = JSON.parse(JSON.stringify(ast)) as TemplateAST;

  switch (operation.op) {
    case 'SET_THEME_TOKEN': {
      if (operation.path && operation.value !== undefined) {
        newAst.themeTokens = setNestedPath(newAst.themeTokens, operation.path, operation.value);
      }
      break;
    }

    case 'UPDATE_PAGE_SETTINGS': {
      if (operation.path && operation.value !== undefined) {
        newAst.pageSettings = setNestedPath(newAst.pageSettings, operation.path, operation.value);
      }
      break;
    }

    case 'INSERT_COMPONENT': {
      if (operation.parentId && operation.value) {
        newAst.rootContainer = insertComponentNode(
          newAst.rootContainer,
          operation.parentId,
          operation.value as ComponentNode,
          operation.index
        );
      }
      break;
    }

    case 'MOVE_COMPONENT': {
      if (operation.targetId && operation.parentId) {
        const { root: step1, removed } = removeComponentNode(newAst.rootContainer, operation.targetId);
        if (removed) {
          newAst.rootContainer = insertComponentNode(step1, operation.parentId, removed, operation.index);
        }
      }
      break;
    }

    case 'REMOVE_COMPONENT': {
      if (operation.targetId) {
        const { root: step1 } = removeComponentNode(newAst.rootContainer, operation.targetId);
        newAst.rootContainer = step1;
      }
      break;
    }

    case 'UPDATE_COMPONENT_STYLE': {
      if (operation.targetId && operation.value) {
        const target = findComponentNode(newAst.rootContainer, operation.targetId);
        if (target) {
          target.styleProps = { ...target.styleProps, ...operation.value };
        }
      }
      break;
    }

    case 'UPDATE_COMPONENT_LAYOUT': {
      if (operation.targetId && operation.value) {
        const target = findComponentNode(newAst.rootContainer, operation.targetId);
        if (target) {
          target.layoutProps = { ...target.layoutProps, ...operation.value };
        }
      }
      break;
    }

    case 'UPDATE_DATA_BINDING': {
      if (operation.targetId && operation.value !== undefined) {
        const target = findComponentNode(newAst.rootContainer, operation.targetId);
        if (target) {
          target.binding = operation.value;
        }
      }
      break;
    }
  }

  return newAst;
}

// EXECUTE FULL TRANSACTION ARRAY
export function applyTransaction(ast: TemplateAST, transaction: OperationTransaction): TemplateAST {
  let curr = ast;
  for (const op of transaction.operations) {
    curr = applyCommandOperation(curr, op);
  }
  curr.version += 1;
  return curr;
}

// VALIDATION ENGINE FOR AST BLUEPRINTS
export interface ValidationError {
  level: 'ERROR' | 'WARNING';
  message: string;
  targetId?: string;
}

export function validateTemplateAST(ast: TemplateAST): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!ast.rootContainer) {
    errors.push({ level: 'ERROR', message: 'Template missing rootContainer element.' });
    return errors;
  }

  function validateNode(node: ComponentNode) {
    if (!node.id) {
      errors.push({ level: 'ERROR', message: 'Component missing required ID property.' });
    }
    if (!node.type) {
      errors.push({ level: 'ERROR', message: `Component ${node.id} missing required type.` });
    }

    // Check headings pagination contract
    if (node.type === 'HeaderComponent' && node.paginationProps && !node.paginationProps.keepWithNext) {
      errors.push({
        level: 'WARNING',
        targetId: node.id,
        message: `Header ${node.id} should have keepWithNext set to true to prevent orphaned headers.`
      });
    }

    if (node.children) {
      node.children.forEach(validateNode);
    }
  }

  validateNode(ast.rootContainer);
  return errors;
}
