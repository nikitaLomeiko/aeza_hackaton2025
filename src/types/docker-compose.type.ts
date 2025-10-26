// Базовые типы
export type PortMapping =
  | string
  | {
      target: number
      published?: number
      protocol?: 'tcp' | 'udp'
      mode?: 'host' | 'ingress'
    }

export type VolumeMapping =
  | string
  | {
      type: 'volume' | 'bind' | 'tmpfs' | 'npipe'
      source?: string
      target: string
      read_only?: boolean
      bind?: {
        propagation:
          | 'rprivate'
          | 'private'
          | 'rshared'
          | 'shared'
          | 'rslave'
          | 'slave'
      }
      volume?: {
        nocopy?: boolean
      }
      tmpfs?: {
        size?: number | string
      }
    }

export type NetworkMapping =
  | string
  | {
      aliases?: string[]
      ipv4_address?: string
      ipv6_address?: string
    }

export type HealthCheck = {
  test: string | string[]
  interval?: string
  timeout?: string
  retries?: number
  start_period?: string
  start_interval?: string
  disable?: boolean
}

export type BuildConfig =
  | string
  | {
      context?: string
      dockerfile?: string
      args?: Record<string, string>
      labels?: Record<string, string>
      cache_from?: string[]
      cache_to?: string[]
      target?: string
      network?: string
      shm_size?: number | string
      extra_hosts?: string[]
      isolation?: string
    }

export type DeployConfig = {
  mode?: 'replicated' | 'global'
  replicas?: number
  placement?: {
    constraints?: string[]
    preferences?: Array<{
      spread: string
    }>
    max_replicas_per_node?: number
  }
  resources?: {
    limits?: {
      cpus?: number | string
      memory?: string
      pids?: number
    }
    reservations?: {
      cpus?: number | string
      memory?: string
      devices?: Array<{
        capabilities?: string[]
        count?: number | string
        device_ids?: string[]
        driver?: string
      }>
    }
  }
  restart_policy?: {
    condition?: 'any' | 'none' | 'on-failure'
    delay?: string
    max_attempts?: number
    window?: string
  }
  update_config?: {
    parallelism?: number
    delay?: string
    failure_action?: 'continue' | 'pause' | 'rollback'
    monitor?: string
    max_failure_ratio?: number
    order?: 'start-first' | 'stop-first'
  }
  rollback_config?: {
    parallelism?: number
    delay?: string
    failure_action?: 'continue' | 'pause'
    monitor?: string
    max_failure_ratio?: number
    order?: 'start-first' | 'stop-first'
  }
  labels?: Record<string, string>
  endpoint_mode?: 'vip' | 'dnsrr'
}

export type ServiceConfig = {
  image?: string
  //   build?: BuildConfig;
  container_name?: string
  depends_on: string[]
  ports?: PortMapping[]
  //   expose?: string[];
  volumes?: string[] // links
  networks?: Record<string, NetworkMapping> | string[] // links
  environment?: Record<string, string> | string[]
  //   env_file?: string | string[];
  // links:
  //   depends_on?: string[] | Record<string, { condition: 'service_started' | 'service_healthy' | 'service_completed_successfully' }>;
  restart?: 'no' | 'always' | 'on-failure' | 'unless-stopped'
  //   deploy?: DeployConfig;
  //   labels?: Record<string, string>;
  command?: string | string[]
  entrypoint?: string | string[]
  user?: string
  working_dir?: string
  //   domainname?: string;
  //   hostname?: string;
  //   mac_address?: string;
  //   privileged?: boolean;
  //   read_only?: boolean;
  //   stdin_open?: boolean;
  //   tty?: boolean;
  //   healthcheck?: HealthCheck;
  //   logging?: {
  //     driver?: string;
  //     options?: Record<string, string>;
  //   };
  secrets?:
    | string[]
    | Array<{
        source: string
        target?: string
        uid?: string
        gid?: string
        mode?: number
      }>
  configs?:
    | string[]
    | Array<{
        source: string
        target?: string
        uid?: string
        gid?: string
        mode?: number
      }>
  //   devices?: string[];
  //   extra_hosts?: string[];
  //   tmpfs?: string | string[];
  //   volumes_from?: string[];
  //   stop_grace_period?: string;
  //   stop_signal?: string;
  //   sysctls?: Record<string, string>;
  //   ulimits?: {
  //     [key: string]: {
  //       hard: number;
  //       soft: number;
  //     } | number;
  //   };
  //   isolation?: string;
  //   platform?: string;
}

export type NetworkConfig = {
  driver?: string
  driver_opts?: Record<string, string>
  attachable?: boolean
  enable_ipv6?: boolean
  ipam?: {
    driver?: string
    config?: Array<{
      subnet?: string
      ip_range?: string
      gateway?: string
      aux_addresses?: Record<string, string>
    }>
    options?: Record<string, string>
  }
  internal?: boolean
  labels?: Record<string, string>
  external?: boolean | { name?: string }
  name?: string
}

export type VolumeConfig = {
  driver?: string
  driver_opts?: Record<string, string>
  external?: boolean | { name?: string }
  labels?: Record<string, string>
  name?: string
}

export type SecretConfig = {
  file?: string
  external?: boolean | { name?: string }
  labels?: Record<string, string>
  name?: string
  environment?: string
  content?: string
}

export type ConfigConfig = {
  file?: string
  external?: boolean | { name?: string }
  labels?: Record<string, string>
  name?: string
  content?: string
}

// Основной тип Docker Compose
export interface DockerComposeConfig {
  version?: string
  name?: string
  services: Record<string, ServiceConfig>
  networks?: Record<string, NetworkConfig>
  volumes?: Record<string, VolumeConfig>
  secrets?: Record<string, SecretConfig>
  configs?: Record<string, ConfigConfig>
  //   x-*?: any; // Custom extensions
}

// Утилитарные типы
export type ServiceName<T extends DockerComposeConfig> = keyof T['services']
export type NetworkName<T extends DockerComposeConfig> = keyof NonNullable<
  T['networks']
>
export type VolumeName<T extends DockerComposeConfig> = keyof NonNullable<
  T['volumes']
>

// Пример использования
export const exampleCompose: DockerComposeConfig = {
  version: '3.8',
  services: {
    web: {
      image: 'nginx:alpine',
      ports: ['80:80'],
      volumes: ['./html:/usr/share/nginx/html'],
      networks: ['frontend'],
    },
    database: {
      image: 'postgres:13',
      environment: {
        POSTGRES_DB: 'app',
        POSTGRES_USER: 'user',
        POSTGRES_PASSWORD: 'password',
      },
      volumes: ['db_data:/var/lib/postgresql/data'],
      networks: ['backend'],
    },
    app: {
      build: {
        context: '.',
        dockerfile: 'Dockerfile',
      },
      ports: ['3000:3000'],
      depends_on: {
        database: {
          condition: 'service_healthy',
        },
      },
      networks: ['frontend', 'backend'],
    },
  },
  networks: {
    frontend: {
      driver: 'bridge',
    },
    backend: {
      driver: 'bridge',
    },
  },
  volumes: {
    db_data: {
      driver: 'local',
    },
  },
}
