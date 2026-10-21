import Config from '../src/repository';

describe('Config Repository Unit Tests', () => {

    test('constructor initializes with empty or custom object', () => {
        const configEmpty = new Config();
        expect(configEmpty.get('app.name')).toBeNull();

        const configCustom = new Config({ app: { name: 'OstroJS', env: 'production' } });
        expect(configCustom.get('app.name')).toBe('OstroJS');
        expect(configCustom.get('app.env')).toBe('production');
    });

    test('get() retrieves nested configuration values with default fallbacks', () => {
        const config = new Config({
            database: {
                default: 'mysql',
                connections: {
                    mysql: { host: '127.0.0.1', port: 3306 }
                }
            }
        });

        expect(config.get('database.default')).toBe('mysql');
        expect(config.get('database.connections.mysql.host')).toBe('127.0.0.1');
        expect(config.get('database.nonexistent')).toBeNull();
        expect(config.get('database.nonexistent', 'fallback')).toBe('fallback');
    });

    test('set() sets nested configuration values', () => {
        const config = new Config();
        config.set('cache.default', 'redis');
        expect(config.get('cache.default')).toBe('redis');

        config.set('cache.stores.redis.host', '127.0.0.1');
        expect(config.get('cache.stores.redis.host')).toBe('127.0.0.1');
    });

    test('has() checks if configuration key exists', () => {
        const config = new Config({ app: { name: 'OstroJS' } });
        expect(config.has('app.name')).toBe(true);
        expect(config.has('app.nonexistent')).toBe(false);
    });

    test('__get and __set proxy methods operate on target', () => {
        const config = new Config({ app: { name: 'TestApp' } });

        expect(config.__get(config, 'app.name')).toBe('TestApp');

        config.__set(config, 'app.name', 'UpdatedApp');
        expect(config.get('app.name')).toBe('UpdatedApp');
    });

});
