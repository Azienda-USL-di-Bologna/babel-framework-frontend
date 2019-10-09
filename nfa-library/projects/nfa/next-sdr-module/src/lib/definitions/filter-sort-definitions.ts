

export class FilterDefinition {
    private _field: string;
    private _filterMatchMode: string;
    private _value: any;

    constructor(field: string, filterMatchMode: string, value: any) {
        this._field = field;
        this._filterMatchMode = filterMatchMode;
        this._value = value;
    }

    public get field(): string {
        return this._field;
    }
    public set field(value: string) {
        this._field = value;
    }
    public get filterMatchMode(): string {
        return this._filterMatchMode;
    }
    public set filterMatchMode(value: string) {
        this._filterMatchMode = value;
    }
    public get value(): any {
        return this._value;
    }
    public set value(value: any) {
        this._value = value;
    }
}


export class SortDefinition {
    private _field: string;
    private _sortMode: string;

    constructor(field: string, sortMode: string) {
        this._field = field;
        this._sortMode = sortMode;
    }

    public get field(): string {
        return this._field;
    }
    public set field(value: string) {
        this._field = value;
    }

    public get orderMode(): string {
        return this._sortMode;
    }
    public set orderMode(value: string) {
        this._sortMode = value;
    }
}

export class AdditionalDataDefinition{
    private _name: string;
    private _value: string;

    constructor(name: string, value: string){
        this._name = name;
        this._value = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        this._value = value;
    }
}


export const FILTER_TYPES = {
    string: {
        startsWith: 'startsWith',
        startsWithIgnoreCase: 'startsWithIgnoreCase',
        contains: 'contains',
        containsIgnoreCase: 'containsIgnoreCase',
        equals: 'equals',
        equalsIgnoreCase: 'equalsIgnoreCase',
    },
    not_string: {
        equals: ''
    }
}

export const SORT_MODES = {
    asc: 'asc',
    desc: 'desc',
}

export class FiltersAndSorts {
    private _filters: FilterDefinition[] = new Array<FilterDefinition>();
    private _sorts: SortDefinition[] = new Array<SortDefinition>();
    private _additionalDatas: AdditionalDataDefinition[] = new Array<AdditionalDataDefinition>();
    private _rows: number;
    private _first: number;

    constructor() { }

    public get filters(): FilterDefinition[] {
        return this._filters;
    }
    public set filters(value: FilterDefinition[]) {
        this._filters = value;
    }
    public get sorts(): SortDefinition[] {
        return this._sorts;
    }
    public set sorts(value: SortDefinition[]) {
        this._sorts = value;
    }
    public get additionalDatas(): AdditionalDataDefinition[] {
        return this._additionalDatas;
    }
    public set additionalDatas(value: AdditionalDataDefinition[]) {
        this._additionalDatas = value;
    }

    addFilter(filterDefinition: FilterDefinition) {
        this._filters.push(filterDefinition);
    }

    addSort(sortDefinition: SortDefinition) {
        this._sorts.push(sortDefinition);
    }
        
    addAdditionalData(additionalDataDefinition: AdditionalDataDefinition) {
        this._additionalDatas.push(additionalDataDefinition);
    }


}

// ================================ PAGINAZIONE ============================

/**
 * Definisce la modalita di paginazione da utilizzare con i {@link NextSDREntityProvider}
 */
export interface PagingConf {
    mode: PagingMode;
    conf?: PagingLimitOffsetConf | PagingPageConf | any;
}

/**
 * Paginazione di tipo Page/Size
 */
export interface PagingPageConf {
    page: number;
    size: number;
}

/**
 * Paginazione di tipo LimitOffset
 */
export interface PagingLimitOffsetConf {
    limit: number;
    offset: number;
}

/**
 * Le modalità di paginazione disponibili
 *  NONE: imposta sui {@link NextSDREntityProvider} una paginazione di tipo PAGE con page 0 e size 999999
 */
export type PagingMode = 'PAGE' | 'LIMIT_OFFSET' | 'NONE';