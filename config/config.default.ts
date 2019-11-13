import { EggAppConfig, PowerPartial } from 'egg';
import { join } from 'path';

exports.default = () => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.view = {
        defaultViewEngine: 'nunjucks',
        defaultExtension: '.njk',
        mapping: {
            '.njk': 'nunjucks',
        },
        root: [
            join(__dirname, '../app/view')
        ].join(',')
    };

    return config;
};
