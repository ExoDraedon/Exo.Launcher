// launcher.js - Sistema de lanzamiento de instancias para Eufonia Studio Launcher v0.2

class GameLauncher {
    constructor() {
        this.isRunning = false;
        this.currentProcess = null;
        this.currentInstance = null;
        
        // Configuración del servidor (puede ser sobrescrita por cada instancia)
        this.defaultServer = {
            ip: "server.cprot.net",
            port: 25570
        };
    }

    // Método principal para lanzar una instancia
    async launchInstance(instanceId, instanceData) {
        if (this.isRunning) {
            throw new Error('Ya hay una instancia en ejecución. Por favor, cierra la instancia actual antes de iniciar otra.');
        }

        this.currentInstance = instanceId;
        this.isRunning = true;

        try {
            // Validar que la instancia existe
            if (!instanceData) {
                throw new Error(`No se encontraron datos para la instancia: ${instanceId}`);
            }

            console.log(`Iniciando instancia: ${instanceData.name} (${instanceId})`);
            
            // Usar configuración de servidor de la instancia o la predeterminada
            const serverConfig = instanceData.server || this.defaultServer;
            
            // Lanzar Minecraft con la configuración del servidor
            await this.launchMinecraft(serverConfig, instanceData);
            
            return {
                success: true,
                message: `Instancia "${instanceData.name}" lanzada correctamente`,
                instanceId: instanceId,
                server: serverConfig
            };
        } catch (error) {
            this.isRunning = false;
            this.currentInstance = null;
            throw error;
        }
    }

    // Método específico para lanzar Minecraft
    async launchMinecraft(serverConfig, instanceData) {
        return new Promise((resolve, reject) => {
            console.log(`Conectando a servidor: ${serverConfig.ip}:${serverConfig.port}`);
            
            // Simular proceso de preparación
            setTimeout(() => {
                console.log('Verificando archivos de Minecraft...');
                
                setTimeout(() => {
                    console.log('Inicializando cliente...');
                    
                    setTimeout(() => {
                        try {
                            // Abrir Minecraft con el protocolo minecraft://
                            this.openMinecraftProtocol(serverConfig);
                            console.log('Minecraft lanzado exitosamente');
                            resolve();
                        } catch (error) {
                            reject(new Error(`Error al lanzar Minecraft: ${error.message}`));
                        }
                    }, 800);
                }, 800);
            }, 500);
        });
    }

    // Función para abrir Minecraft usando el protocolo minecraft://
    openMinecraftProtocol(serverConfig) {
        const { ip, port } = serverConfig;
        
        // Crear la URL del protocolo Minecraft
        const minecraftUrl = `minecraft://connect?serverUrl=${encodeURIComponent(ip)}&serverPort=${port}`;
        
        console.log(`Intentando abrir: ${minecraftUrl}`);
        
        // Intentar abrir Minecraft
        try {
            // Primer intento en nueva pestaña
            window.open(minecraftUrl, '_blank');
            
            // Segundo intento en la misma pestaña (para algunos navegadores)
            setTimeout(() => {
                window.open(minecraftUrl, '_self');
            }, 100);
            
            // Tercer intento con location.href (método alternativo)
            setTimeout(() => {
                window.location.href = minecraftUrl;
            }, 200);
            
        } catch (error) {
            throw new Error(`No se pudo abrir Minecraft: ${error.message}`);
        }
    }

    // Método para cerrar la instancia actual
    terminateInstance() {
        if (!this.isRunning) {
            return {
                success: false,
                message: 'No hay ninguna instancia en ejecución'
            };
        }

        console.log(`Cerrando instancia: ${this.currentInstance}`);
        
        // Simular cierre del proceso
        this.isRunning = false;
        this.currentInstance = null;

        return {
            success: true,
            message: 'Instancia cerrada correctamente'
        };
    }

    // Verificar estado actual del launcher
    getStatus() {
        return {
            isRunning: this.isRunning,
            currentInstance: this.currentInstance,
            timestamp: new Date().toISOString()
        };
    }

    // Método para obtener información del sistema (útil para debugging)
    getSystemInfo() {
        return {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
            online: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // Método para verificar si Minecraft está instalado
    checkMinecraftInstalled() {
        // Esta es una verificación básica - en la práctica sería más compleja
        return new Promise((resolve) => {
            const testLink = document.createElement('a');
            testLink.href = 'minecraft://';
            testLink.style.display = 'none';
            document.body.appendChild(testLink);
            
            setTimeout(() => {
                document.body.removeChild(testLink);
                // No hay forma confiable de verificar desde el navegador, así que asumimos que está instalado
                resolve(true);
            }, 100);
        });
    }
}

// Crear instancia global del launcher
const gameLauncher = new GameLauncher();

// Función de conveniencia para lanzar instancias desde el UI
function launchGameInstance(instanceId, instanceData) {
    return gameLauncher.launchInstance(instanceId, instanceData);
}

// Función de conveniencia para cerrar instancias
function closeGameInstance() {
    return gameLauncher.terminateInstance();
}

// Función directa para abrir Minecraft (como en el ejemplo)
function openMinecraftDirect(ip = "server.cprot.net", port = 25570) {
    const url = `minecraft://connect?serverUrl=${encodeURIComponent(ip)}&serverPort=${port}`;
    
    console.log(`Abriendo Minecraft directamente: ${url}`);
    
    // Múltiples métodos para maximizar compatibilidad
    setTimeout(() => {
        window.open(url, '_blank');
    }, 100);
    
    setTimeout(() => {
        window.open(url, '_self');
    }, 200);
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Exportar para uso global (en un entorno de navegador)
if (typeof window !== 'undefined') {
    window.GameLauncher = GameLauncher;
    window.gameLauncher = gameLauncher;
    window.launchGameInstance = launchGameInstance;
    window.closeGameInstance = closeGameInstance;
    window.openMinecraftDirect = openMinecraftDirect;
}