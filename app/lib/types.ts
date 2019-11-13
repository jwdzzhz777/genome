export interface ApiMetaData {
    methods: [string];
    params?: object;
    response?: object;
}

export interface ApiData {
    [propName: string]: ApiMetaData;
}
