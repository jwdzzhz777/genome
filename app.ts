import { Application } from 'egg';

export default (app: Application) => {
    let { coreMiddleware } = app.config;

    let bodyParserIndex = coreMiddleware.indexOf('bodyParser');

    if (bodyParserIndex > -1) {
        coreMiddleware.splice(bodyParserIndex, 0, 'genome');
    } else {
        coreMiddleware.push('genome');
    }
};
