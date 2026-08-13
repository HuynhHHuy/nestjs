export type TodosConfig = {
    maxTodosPerUser: number,
    maxTitleLength: number,
    defaultPageSize: number,
}

export const TODOS_CONFIG = Symbol('TODOS_CONFIG');