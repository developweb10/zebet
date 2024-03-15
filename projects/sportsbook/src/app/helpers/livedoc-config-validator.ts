import { ValidatorFn, AbstractControl } from '@angular/forms';
import { LiveDocConfig } from '@livedoc';


export function liveDocConfigValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        return validateConfiguration(control.value) ? null : {
            liveDocConfigValidator: {
                value: control.value
            }
        };
    };
}

function validateConfiguration(configText: string) {
    let config: LiveDocConfig;
    try {
        config = JSON.parse(configText);
    } catch (e) {
        return false;
    }

    if ( config === null || typeof config !== 'object') { return false; }
    if ( config.servers === null || !Array.isArray(config.servers) ) { return false; }

    return config.servers.every(function validServer(server) {
        if ( server === null || typeof server !== 'object' ) { return false; }

        return Object.keys(server).length && Object.entries(server).every(([key, value]) =>
            // ['name', 'uri', 'default', 'prefixes'].includes(key) &&
            key === 'secure' && ( value === true || value === false ) ||
            key === 'comments' && (value === undefined || value === null || typeof value === 'string') ||
            key === 'name' && (value === undefined || value === null || typeof value === 'string') ||
            key === 'uri'  && (value === undefined || value === null || typeof value === 'string') ||
            key === 'default' && (value === undefined || value === null || typeof value === 'boolean') ||
            key === 'prefixes' && (value === undefined || value === null ||
                Array.isArray(value) && value.every(prefix => typeof prefix === 'string')
            ) ||
            key === 'transports' && Array.isArray(value) && value.every(v => typeof v === 'string')
        );
    });

}
