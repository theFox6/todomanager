import { app, net, protocol } from 'electron'
import path from 'path'

/**
 * register protocols with privilege
 *
 * caution: only call **once** before app's ready event trigged.
 */
export function registerProtocolsPrivilege() {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: 'app',
            privileges: {
                secure: true,
                standard: true, // work as http://
                supportFetchAPI: true,
                // allowServiceWorkers: true,
            },
        },
    ])
}

/**
 * register app:// protocol
 */
export function registerAppProtocol() {
    protocol.handle('app', (request, callback) => {
        // console.log(`app-protocol: ${request.url}`);
        let requrl = new URL(request.url)
        let reqpath = requrl.pathname
        let boundary = path.join('/', reqpath) // used for prevent ../.. attack

        return net.fetch('file:///' + path.join(app.getAppPath(), 'out/renderer', boundary))
    })
}
