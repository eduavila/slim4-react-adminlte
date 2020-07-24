/* CacheBuster component */
import packageJson from '../../package.json';
global.appVersion = packageJson.version;

import React from 'react';

// Verifica versão.
const checkVersion = (versionA, versionB) => {
    const versionsA = versionA.split(/\./g);

    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
        const a = Number(versionsA.shift());

        const b = Number(versionsB.shift());
        // eslint-disable-next-line no-continue
        if (a === b) continue;
        // eslint-disable-next-line no-restricted-globals
        return a > b || isNaN(b);
    }
    return false;
}

class CacheBuster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isLatestVersion: false,
            refreshCacheAndReload: () => {
                console.log('Clearing cache and hard reloading...')
                // if (typeof caches === 'undefined' || caches === null) {
                //     // Service worker cache should be cleared with caches.delete()
                //     caches.keys().then(function (names) {
                //         for (let name of names) caches.delete(name);
                //     });
                // }
                // delete browser cache and hard reload
                window.location.reload(true);
            }
        };
    }

    //Busca arquivo de versão 
    componentDidMount() {
        fetch('meta.json',{cache: "no-cache"})
            .then((response) => response.json())
            .then((meta) => {
                const latestVersion = meta.version;
                const currentVersion = global.appVersion;

                const shouldForceRefresh = checkVersion(latestVersion, currentVersion);
                if (shouldForceRefresh) {
                    console.log(`Temos uma nova versão -  ${latestVersion}. Deve forçar a atualização!`);
                    this.setState({ loading: false, isLatestVersion: false });
                } else {
                    console.log(`Você já tem a versão mais recente - ${latestVersion}. Nenhuma atualização de cache é necessária.`);
                    this.setState({ loading: false, isLatestVersion: true });
                }
            });
    }

    render() {
        const { loading, isLatestVersion, refreshCacheAndReload } = this.state;
        return this.props.children({ loading, isLatestVersion, refreshCacheAndReload });
    }
}

export default CacheBuster;