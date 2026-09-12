# Complete APEX source code

All source and configuration files, including the lockfile. Generated files and this listing itself are excluded.

## .gitignore

Exact workspace path: `C:/Users/jadav/Coding/car racing game/.gitignore`

````
node_modules/
dist/
.env
*.log
test-artifacts/
release/

````

## .github/workflows/ci.yml

Exact workspace path: `C:/Users/jadav/Coding/car racing game/.github/workflows/ci.yml`

````
name: Check racing game
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build

````

## package.json

Exact workspace path: `C:/Users/jadav/Coding/car racing game/package.json`

````
{
  "name": "apex-friends-racing",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "node server/index.js --dev",
    "build": "vite build",
    "start": "node server/index.js",
    "test": "node --test",
    "test:browser": "node scripts/browser-check.mjs",
    "format": "prettier --write client server shared test scripts *.js *.json"
  },
  "dependencies": {
    "@babylonjs/core": "^8.0.0",
    "cannon-es": "^0.20.0",
    "express": "^5.1.0",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.63.0",
    "prettier": "^3.9.6",
    "vite": "^7.1.0"
  }
}

````

## package-lock.json

Exact workspace path: `C:/Users/jadav/Coding/car racing game/package-lock.json`

````
{
  "name": "apex-friends-racing",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "apex-friends-racing",
      "version": "1.0.0",
      "dependencies": {
        "@babylonjs/core": "^8.0.0",
        "cannon-es": "^0.20.0",
        "express": "^5.1.0",
        "socket.io": "^4.8.1",
        "socket.io-client": "^4.8.1"
      },
      "devDependencies": {
        "@playwright/test": "^1.63.0",
        "prettier": "^3.9.6",
        "vite": "^7.1.0"
      },
      "engines": {
        "node": ">=22.12.0"
      }
    },
    "node_modules/@babylonjs/core": {
      "version": "8.56.2",
      "resolved": "https://registry.npmjs.org/@babylonjs/core/-/core-8.56.2.tgz",
      "integrity": "sha512-UShs1pt8tSTLYOoITWclXPNrUZUpuHvB2Ur2L1D+uM8c9qaAYOi9gjkurOkQwIlbPGqwQHWImGEyiyix0mQ1dg==",
      "license": "Apache-2.0"
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.28.2.tgz",
      "integrity": "sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.28.2.tgz",
      "integrity": "sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.28.2.tgz",
      "integrity": "sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.28.2.tgz",
      "integrity": "sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.28.2.tgz",
      "integrity": "sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.28.2.tgz",
      "integrity": "sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.28.2.tgz",
      "integrity": "sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.28.2.tgz",
      "integrity": "sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.28.2.tgz",
      "integrity": "sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.28.2.tgz",
      "integrity": "sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.28.2.tgz",
      "integrity": "sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.28.2.tgz",
      "integrity": "sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.28.2.tgz",
      "integrity": "sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.28.2.tgz",
      "integrity": "sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.28.2.tgz",
      "integrity": "sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.28.2.tgz",
      "integrity": "sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.28.2.tgz",
      "integrity": "sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.28.2.tgz",
      "integrity": "sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.28.2.tgz",
      "integrity": "sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.28.2.tgz",
      "integrity": "sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.28.2.tgz",
      "integrity": "sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.28.2.tgz",
      "integrity": "sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.28.2.tgz",
      "integrity": "sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.28.2.tgz",
      "integrity": "sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.28.2.tgz",
      "integrity": "sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@napi-rs/lzma-linux-x64-gnu": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/@napi-rs/lzma-linux-x64-gnu/-/lzma-linux-x64-gnu-1.5.1.tgz",
      "integrity": "sha512-oTXEIha4SsuXdTA4Iyskj0kpdx2yVXdhd75c2v3xGrHFfVMsbhTPZU/nMPL4sWKo4pBHm3aucLaqGlF696dTyQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^22.20 || ^24.12 || >=25"
      }
    },
    "node_modules/@playwright/test": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/@playwright/test/-/test-1.63.0.tgz",
      "integrity": "sha512-oxMK4vllB9RK5NQ2l1pq1IfOf2AvnEuj/vYGDj0H2nMtmtZpKtCwt/l00GEO6xjGfpBNAvjovvYdCm50dRQkpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.63.2.tgz",
      "integrity": "sha512-Xa6RDoWa+hNiX6PgsljlH6W75RaONx3y6PVlbLhkEWW+GaPQ3dP5gwbL/erAzQHWwkvW5UxdD5l87Qx2FAQ/4A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.63.2.tgz",
      "integrity": "sha512-vNASxsghMfQ5s+v3PrpnJd+ryL/26lxCCaGI+sDJ7VzmHiYXIrrVltsDhaawxLM1WcoMU2oYlbPHLaYQtBzhcg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.63.2.tgz",
      "integrity": "sha512-0dWDjmlrpZAgjPD/aPzUDhBW8APLRjAni5bOrM76wiiZm+E+KTMVKNhAzaTBohz8UyO2fKNAl0+fygbe2HZXOA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.63.2.tgz",
      "integrity": "sha512-N58uktcwzk3+qT4KHEuNdIxX1N01RWrkfVoml69EAbSaNDL+sbNVLx2RMl4Qd23lpA0fgPvyh5hHb4weD5WKmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.63.2.tgz",
      "integrity": "sha512-HWF2zH8EAp2scWRpt2PGe6iUGz7zi04waXsdRr3zb4DWCk2ImIo5FZu0jjmD53nP/DGSvnW0e7/1ToCNZs2lZw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.63.2.tgz",
      "integrity": "sha512-MkvcwHMnzPSMOQEwB6wHnLzmc+hT8BGc5bW/Mhmjjgx3wbj6VBnlc47XsK74kD0K9MikFfXpQqyz4NUXaUW62A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.63.2.tgz",
      "integrity": "sha512-xe1bCKPJaKsD0tfd7Rb6bGfUogJTpKbTEEthsfdb7hTfTRNJVQTdirabQx0o6ERVba/smkM720soMY+0QnrlSQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.63.2.tgz",
      "integrity": "sha512-yOM7LdK0p6gk6+Q773OEwtlsikT1TL3yMmYsTtRlDRPha5vV2DC5x7LqRWDr6f3cSYNMKVqxzffXv8ivxNBIFQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.63.2.tgz",
      "integrity": "sha512-qiWuJJV3DybA2IfzvRimeKXGrGuVPv1zobSY/26KnP3HbV0VcNb3ECzgvtbvF3xjSMkcooou6HASXZuLdjnhpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.63.2.tgz",
      "integrity": "sha512-akcZquRzCY/KpUoZAMBhGf7oi4LmXq1BzRA5CPAC3rkUf28Y/sAYV3jSL+JKd7cwEyFvR5G0XVZ0gaMedP+60A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.63.2.tgz",
      "integrity": "sha512-fNwYHrPyYyxauPzX/cpYw8Z7LQpp+DGA0KCoswA0aVFBpmdMil9XgjB8V3Ny64Ihu797+GKcuJqnsOKEmor7fA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.63.2.tgz",
      "integrity": "sha512-XfvsgzR7DZqREdst7K1Mj3ilSUM5xLAHJcIMDFPKdxTs9q5VHOT8aMA+a683fqBu7DQl8+Sd9HCsQYL8EMY9qA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.63.2.tgz",
      "integrity": "sha512-Pp7gVZggEFlbcuztay+/U0gVG9S1XAh8i7I1Re/htbAzo43P5wHZHw6pTyzotISqlKohoh9RpIfnOz3RbemK1w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.63.2.tgz",
      "integrity": "sha512-zkgL2xff6i7u5hau/m6FGeS8gRkLEdgLw522WGmdWWlLd9btmNl3S80mcEjtGq+kvgUekQ3+BOYLLLcPlS2LIA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.63.2.tgz",
      "integrity": "sha512-qOheJomrkVCbbHFJ7L3J97cnhfogKqguAQphv26+3ZsAQIF1L19b+dArl//s8rjJHJLz9byykyM8NBP4nmSa1g==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.63.2.tgz",
      "integrity": "sha512-XlxLD54wQhH3FciCgMofxBw27NzUe818gJH410qWvc41UT0ZFcgxVjyX5/EK8MPTupjeVWqN5oy+9pCA9mqfCA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.63.2.tgz",
      "integrity": "sha512-vdryWeRb2bLJZf0Fv/W8se6nvsHe2PkTCxV0meheK3nQE+G90VCJcke51Miy1yQRsfm2uqIyjXOu4wmUzbTtkQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.63.2.tgz",
      "integrity": "sha512-bcq2h2pkKmH2po4cZV8VWzO4lL40STyu/nLoFpYMQp9C2tCVNTdcVv86MwSsn3D5s1FBe2Ty1atqvVAUTMimNg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.63.2.tgz",
      "integrity": "sha512-EGoo5DMVMRkTId8fuTDaoxVlR5ZTsKULUezRjd9gCw5eeY+DjCvDpZAOlNUvKPGX+7rS1RWx6j+yOpNPx0cUgQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.63.2.tgz",
      "integrity": "sha512-MErl12k7BFHZG1TI9QF/3lSSZARzq9KgNy/FjnqFMCkv+N4RSSzoUCA5h2mqHX4Mox3WaTVKblyzhQ1zRb2ZuQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.63.2.tgz",
      "integrity": "sha512-ILs8k07Wh4p0PsNY4wYLEaXZKMOpVhrG5QDB0yHhGhuzOfDlnyHN6sflL4El/MpUP1y8uY2lUZrv4oBS6pTT3g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.63.2.tgz",
      "integrity": "sha512-hKgB3nz/TKD3Wv78XEsyXzQsNjvhOHmwKQTvXADGOyU/cIClZDO7DsoggbdmJDPGp5V80tA3Vfv61PaKTLH3LA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.63.2.tgz",
      "integrity": "sha512-T4wf1mudIDxN8Q/CWIBJC1u5gQUc+r5mPvlwoSbIvNkyVTP2TAFeobEmst5AQ4gMyAz4sSByVdoTDfvTmGK/8g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.63.2.tgz",
      "integrity": "sha512-tC3IY7qoaD9Ll3/8WJQn49j5V2f/NuI9S41NOE2iM5MPs3sPIvOkVToLcz/7Bz4pyF7PSvrtwu8I/pUrGOSecQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.63.2.tgz",
      "integrity": "sha512-6NHnk/K3eq2ZFYcU1X8g67s9qIJRCOTT92gwLMVBp08dB2uuuwI1/Q/empzL2Bfr2f2WRLJVwpp90RmacQyFkw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@socket.io/component-emitter": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@socket.io/component-emitter/-/component-emitter-3.1.2.tgz",
      "integrity": "sha512-9BCxFwvbGg/RsZK9tjXd8s4UcwR0MWeFQ1XEKIQVVvAGJyINdrqKMcTRyLoK8Rse1GjzLV9cwjWV1olXRWEXVA==",
      "license": "MIT"
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.20.2",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.20.2.tgz",
      "integrity": "sha512-xlvWf4Vs9n1PEVYwP1n4vvG07M6y8WgvJ2t0vbrWTmijsIHp1cS+uJ2kMIRdY3nHZK0nCYKrPeD171+SzF4/zw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/ws": {
      "version": "8.18.1",
      "resolved": "https://registry.npmjs.org/@types/ws/-/ws-8.18.1.tgz",
      "integrity": "sha512-ThVF6DCVhA8kUGy+aazFQ4kXQ7E1Ty7A3ypFOe0IcJV8O/M511G99AW24irKrW56Wt44yG9+ij8FaqoBGkuBXg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/base64id": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/base64id/-/base64id-2.0.0.tgz",
      "integrity": "sha512-lGe34o6EHj9y3Kts9R4ZYs/Gr+6N7MCaMlIFA3F1R2O5/m7K06AxfSeO5530PEERE6/WyEg3lsuyw4GHlPZHog==",
      "license": "MIT",
      "engines": {
        "node": "^4.5.0 || >= 5.9"
      }
    },
    "node_modules/body-parser": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.3.0.tgz",
      "integrity": "sha512-2cGmJupaNgg+QUwVLAucDuWuoMZ6EX9iHDRswZ5lsNYEmwPaRknMPCLZz07yTzVq/83p4o/wzbDZbBrTvGGTIw==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^2.0.0",
        "debug": "^4.4.3",
        "http-errors": "^2.0.1",
        "iconv-lite": "^0.7.2",
        "on-finished": "^2.4.1",
        "qs": "^6.15.2",
        "raw-body": "^3.0.2",
        "type-is": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/body-parser/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/cannon-es": {
      "version": "0.20.0",
      "resolved": "https://registry.npmjs.org/cannon-es/-/cannon-es-0.20.0.tgz",
      "integrity": "sha512-eZhWTZIkFOnMAJOgfXJa9+b3kVlvG+FX4mdkpePev/w/rP5V8NRquGyEozcjPfEoXUlb+p7d9SUcmDSn14prOA==",
      "license": "MIT"
    },
    "node_modules/content-disposition": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.1.0.tgz",
      "integrity": "sha512-5jRCH9Z/+DRP7rkvY83B+yGIGX96OYdJmzngqnw2SBSxqCFPd0w2km3s5iawpGX8krnwSGmF0FW5Nhr0Hfai3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/engine.io": {
      "version": "6.6.10",
      "resolved": "https://registry.npmjs.org/engine.io/-/engine.io-6.6.10.tgz",
      "integrity": "sha512-9/lX2bdlizlCXMHRMOIm03VBQHQYC7VvydcxtTAUJRxNW1QzM/2PMFSmr6h/lCiMHcyCP6abK+t9Q+j4vekk8Q==",
      "license": "MIT",
      "dependencies": {
        "@types/cors": "^2.8.12",
        "@types/node": ">=10.0.0",
        "@types/ws": "^8.5.12",
        "accepts": "~1.3.4",
        "cookie": "~0.7.2",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.21.0"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/engine.io-client": {
      "version": "6.6.6",
      "resolved": "https://registry.npmjs.org/engine.io-client/-/engine.io-client-6.6.6.tgz",
      "integrity": "sha512-iY6QdftLQ9pyiPoX082bpf/u1UewnOaJrtJIF9T0++QB34lZrj0uP+Q/bj8AlUsAxqhnkTV2BS8SBZSxOmoV5Q==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-parser": "~5.2.1",
        "ws": "~8.21.0",
        "xmlhttprequest-ssl": "~2.1.1"
      }
    },
    "node_modules/engine.io-parser": {
      "version": "5.2.3",
      "resolved": "https://registry.npmjs.org/engine.io-parser/-/engine.io-parser-5.2.3.tgz",
      "integrity": "sha512-HqD3yTBfnBxIrbnM1DoD6Pcq8NECnh8d4As1Qgh0z5Gg3jRRIqijury0CL3ghu/edArpUYiYqQiDUQBIs4np3Q==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/engine.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/engine.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/esbuild": {
      "version": "0.28.2",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.28.2.tgz",
      "integrity": "sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.28.2",
        "@esbuild/android-arm": "0.28.2",
        "@esbuild/android-arm64": "0.28.2",
        "@esbuild/android-x64": "0.28.2",
        "@esbuild/darwin-arm64": "0.28.2",
        "@esbuild/darwin-x64": "0.28.2",
        "@esbuild/freebsd-arm64": "0.28.2",
        "@esbuild/freebsd-x64": "0.28.2",
        "@esbuild/linux-arm": "0.28.2",
        "@esbuild/linux-arm64": "0.28.2",
        "@esbuild/linux-ia32": "0.28.2",
        "@esbuild/linux-loong64": "0.28.2",
        "@esbuild/linux-mips64el": "0.28.2",
        "@esbuild/linux-ppc64": "0.28.2",
        "@esbuild/linux-riscv64": "0.28.2",
        "@esbuild/linux-s390x": "0.28.2",
        "@esbuild/linux-x64": "0.28.2",
        "@esbuild/netbsd-arm64": "0.28.2",
        "@esbuild/netbsd-x64": "0.28.2",
        "@esbuild/openbsd-arm64": "0.28.2",
        "@esbuild/openbsd-x64": "0.28.2",
        "@esbuild/openharmony-arm64": "0.28.2",
        "@esbuild/sunos-x64": "0.28.2",
        "@esbuild/win32-arm64": "0.28.2",
        "@esbuild/win32-ia32": "0.28.2",
        "@esbuild/win32-x64": "0.28.2"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/express/-/express-5.2.1.tgz",
      "integrity": "sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.1",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.3.tgz",
      "integrity": "sha512-IKXpvIzjnC9XTAUbVBcMfGS0EPaIXtW6v+zr+RRp+hqULEpo0owZax6wyRwPOJbWbzjYspQwusTsfVr0ifh4uQ==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.1.tgz",
      "integrity": "sha512-yz3xRaG20c6/BOzvYoDaGtPmGscs7YivItZEEqe6GbwNfHuxu9YNmvnEkMzKldAGY4/80pRcQRZSEnhquk9XuQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/negotiator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.1.0.tgz",
      "integrity": "sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/negotiator/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.4.2",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.4.2.tgz",
      "integrity": "sha512-qRcuIdP69NPm4qbACK+aDogI5CBDMi1jKe0ry5rSQJz8JVLsC7jV8XpiJjGRLLol3N+R5ihGYcrPLTno6pAdBA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.63.0.tgz",
      "integrity": "sha512-+7ziBLidS4NaNCdt57SUDT+wYmmd5fmiQejUic/kb+YsYSCPyOOE9sebzMjNmQrsnNpDJqd4WHvV/8lfKfUDUg==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.63.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.63.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.63.0.tgz",
      "integrity": "sha512-rYCsBF/M5HjUch52bbtVONEFjv6Xu8sm8h72dNlR5bzIE1fvC/bxgspzkjSfU+MweEMmPM8KJebG6nnyxo5mCg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prettier": {
      "version": "3.9.6",
      "resolved": "https://registry.npmjs.org/prettier/-/prettier-3.9.6.tgz",
      "integrity": "sha512-OpN0zzVdiaiAhxpuuj5efpIS4sY9j7bY6uR5mnj5yPzGkdkjNKSJeUThPb60Jw29QuAZgA4o+/iB49kFiaBX6g==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "prettier": "bin/prettier.cjs"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/prettier/prettier?sponsor=1"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.16.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.16.0.tgz",
      "integrity": "sha512-h6fhOIaRrID2CbEY2fqs+7t+UXZo+MLAnU5gRIq85uFtdiUPCdsApMlHhXogKVM4HM2DVbIjGNTTYH2OcmP1vA==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "es-define-property": "^1.0.1",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.3.0.tgz",
      "integrity": "sha512-hek2mFQpPuI4E1BBKrSto+BU3e3x4xuarsbiwr3+lf7p44juvFMV0XFWQAP3xUyqXA4RrXLIoaSUGbSt056ZMw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/rollup": {
      "version": "4.63.2",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.63.2.tgz",
      "integrity": "sha512-l5eyksV4tPBj6lJyEa37YzIOCSOV7lkZzEHUdpjWZbtD7wTcFYmEYXSgm5bT4vV+dZLb9rBG1W9GROOG4NS4Ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.9"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@napi-rs/lzma-linux-x64-gnu": "1.5.1",
        "@rollup/rollup-android-arm-eabi": "4.63.2",
        "@rollup/rollup-android-arm64": "4.63.2",
        "@rollup/rollup-darwin-arm64": "4.63.2",
        "@rollup/rollup-darwin-x64": "4.63.2",
        "@rollup/rollup-freebsd-arm64": "4.63.2",
        "@rollup/rollup-freebsd-x64": "4.63.2",
        "@rollup/rollup-linux-arm-gnueabihf": "4.63.2",
        "@rollup/rollup-linux-arm-musleabihf": "4.63.2",
        "@rollup/rollup-linux-arm64-gnu": "4.63.2",
        "@rollup/rollup-linux-arm64-musl": "4.63.2",
        "@rollup/rollup-linux-loong64-gnu": "4.63.2",
        "@rollup/rollup-linux-loong64-musl": "4.63.2",
        "@rollup/rollup-linux-ppc64-gnu": "4.63.2",
        "@rollup/rollup-linux-ppc64-musl": "4.63.2",
        "@rollup/rollup-linux-riscv64-gnu": "4.63.2",
        "@rollup/rollup-linux-riscv64-musl": "4.63.2",
        "@rollup/rollup-linux-s390x-gnu": "4.63.2",
        "@rollup/rollup-linux-x64-gnu": "4.63.2",
        "@rollup/rollup-linux-x64-musl": "4.63.2",
        "@rollup/rollup-openbsd-x64": "4.63.2",
        "@rollup/rollup-openharmony-arm64": "4.63.2",
        "@rollup/rollup-win32-arm64-msvc": "4.63.2",
        "@rollup/rollup-win32-ia32-msvc": "4.63.2",
        "@rollup/rollup-win32-x64-gnu": "4.63.2",
        "@rollup/rollup-win32-x64-msvc": "4.63.2",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/socket.io": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io/-/socket.io-4.8.3.tgz",
      "integrity": "sha512-2Dd78bqzzjE6KPkD5fHZmDAKRNe3J15q+YHDrIsy9WEkqttc7GY+kT9OBLSMaPbQaEd0x1BjcmtMtXkfpc+T5A==",
      "license": "MIT",
      "dependencies": {
        "accepts": "~1.3.4",
        "base64id": "~2.0.0",
        "cors": "~2.8.5",
        "debug": "~4.4.1",
        "engine.io": "~6.6.0",
        "socket.io-adapter": "~2.5.2",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.2.0"
      }
    },
    "node_modules/socket.io-adapter": {
      "version": "2.5.8",
      "resolved": "https://registry.npmjs.org/socket.io-adapter/-/socket.io-adapter-2.5.8.tgz",
      "integrity": "sha512-6Oy52pbg+kvdCVvjcN+FnY7BvxZ7cIHNScbvztT/It5d0vbwoJoVZmF2gjJmnV0/4WlXRfG15zc45ySk9Ah8bw==",
      "license": "MIT",
      "dependencies": {
        "debug": "~4.4.1",
        "ws": "~8.21.0"
      }
    },
    "node_modules/socket.io-client": {
      "version": "4.8.3",
      "resolved": "https://registry.npmjs.org/socket.io-client/-/socket.io-client-4.8.3.tgz",
      "integrity": "sha512-uP0bpjWrjQmUt5DTHq9RuoCBdFJF10cdX9X+a368j/Ft0wmaVgxlrjvK3kjvgCODOMMOz9lcaRzxmso0bTWZ/g==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1",
        "engine.io-client": "~6.6.1",
        "socket.io-parser": "~4.2.4"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io-parser": {
      "version": "4.2.7",
      "resolved": "https://registry.npmjs.org/socket.io-parser/-/socket.io-parser-4.2.7.tgz",
      "integrity": "sha512-IH/iSeO9T6gz1KkFleGDWkG9N3dl4jXVYUtMhIqH10Md0ttMer8nUNWiP1DKuNrybD2xBrixLJdCC9J6ECoYkg==",
      "license": "MIT",
      "dependencies": {
        "@socket.io/component-emitter": "~3.1.0",
        "debug": "~4.4.1"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/socket.io/node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/socket.io/node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/type-is": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.1.0.tgz",
      "integrity": "sha512-faYHw0anBbc/kWF3zFTEnxSFOAGUX9GFbOBthvDdLsIlEoWOFOtS0zgCiQYwIskL9iGXZL3kAXD8OoZ4GmMATA==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.0.0",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/type-is/node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vite": {
      "version": "7.3.6",
      "resolved": "https://registry.npmjs.org/vite/-/vite-7.3.6.tgz",
      "integrity": "sha512-4XP60spRGjSZFf1qYH+dJIkK2znL3zQfl9KkOV9MkkRR/3Dls0dxaBsQPTloEc5BLXWPL9vsOxopxyKoMmDueg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.27.0 || ^0.28.0",
        "fdir": "^6.5.0",
        "picomatch": "^4.0.3",
        "postcss": "^8.5.6",
        "rollup": "^4.43.0",
        "tinyglobby": "^0.2.15"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "lightningcss": "^1.21.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    },
    "node_modules/ws": {
      "version": "8.21.3",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.21.3.tgz",
      "integrity": "sha512-201TZ/kPWxoPr/OKWjquZR1SWKXcvxdH+e1xrx89b3YbmzLMFCLfnaG1HFIgWzJOEWZ7MvpK++odZufgYR50Rw==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/xmlhttprequest-ssl": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/xmlhttprequest-ssl/-/xmlhttprequest-ssl-2.1.2.tgz",
      "integrity": "sha512-TEU+nJVUUnA4CYJFLvK5X9AOeH4KvDvhIfm0vV1GaQRtchnG0hgK5p8hw/xjv8cunWYCsiPCSDzObPyhEwq3KQ==",
      "engines": {
        "node": ">=0.4.0"
      }
    }
  }
}

````

## vite.config.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/vite.config.js`

````
import { defineConfig } from "vite";
export default defineConfig({
  root: "client",
  build: { outDir: "../dist", emptyOutDir: true },
  server: { host: "127.0.0.1" },
});

````

## render.yaml

Exact workspace path: `C:/Users/jadav/Coding/car racing game/render.yaml`

````
services:
  - type: web
    name: apex-friends-racing
    runtime: node
    plan: free
    buildCommand: npm ci --include=dev && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: 24.19.0

````

## client/index.html

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/index.html`

````
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#122620" />
    <title>APEX — Friends on the grid</title>
  </head>
  <body>
    <canvas id="game" aria-label="3D racing circuit"></canvas>
    <header>
      <a class="brand" href="/"
        >A<span>↗</span>PEX <small>FRIENDS ON THE GRID</small></a
      >
      <div class="top-right">
        <span id="connection">CONNECTING</span
        ><button id="sound" class="small">SOUND OFF</button
        ><button id="quality" class="small">QUALITY HIGH</button>
      </div>
    </header>
    <main id="home">
      <div class="eyebrow">PRIVATE ROOMS. REAL RIVALRIES.</div>
      <h1>Good friends.<br /><em>Bad losers.</em></h1>
      <p class="intro">
        A little friendly competition.<br />Three laps. Six drivers. One very
        smug winner.
      </p>
      <section class="panel">
        <label for="nickname">YOUR DRIVER NAME</label
        ><input
          id="nickname"
          maxlength="18"
          placeholder="e.g. Dhiraj"
          autocomplete="nickname"
        /><button id="create" class="primary">
          CREATE A RACE <span>↗</span>
        </button>
        <div class="divider">OR JOIN YOUR FRIENDS</div>
        <div class="join">
          <input
            id="code"
            maxlength="5"
            placeholder="ROOM CODE"
            aria-label="Room code"
          /><button id="join">JOIN →</button>
        </div>
        <p class="micro">No account. No downloads. Just drive.</p>
      </section>
      <div class="specs">
        <span>01 <b>PALM CIRCUIT</b></span
        ><span>02—06 <b>DRIVERS</b></span
        ><span>03 <b>LAPS</b></span>
      </div>
    </main>
    <section id="lobby" class="overlay panel" hidden>
      <div class="eyebrow">THE PADDOCK</div>
      <h2>Your grid is waiting.</h2>
      <label>PRIVATE ROOM CODE</label>
      <div class="room-code" id="roomCode"></div>
      <button id="copy">COPY INVITE LINK ↗</button>
      <div id="players"></div>
      <button id="start" class="primary">START RACE →</button>
      <p id="waiting" class="micro"></p>
      <button class="leave small">LEAVE ROOM</button>
    </section>
    <section id="hud" hidden>
      <div class="hud-top">
        <div><label>LAP</label><strong id="lap">1 / 3</strong></div>
        <div><label>POSITION</label><strong id="position">1 / 2</strong></div>
        <div><label>RACE TIME</label><strong id="timer">0:00.0</strong></div>
        <button class="leave small">LEAVE</button>
      </div>
      <div id="leaderboard" class="panel"></div>
      <div class="speed"><strong id="speed">0</strong><span>KM/H</span></div>
      <div id="finishMessage"></div>
      <div id="countdown"></div>
      <canvas id="minimap" width="180" height="200"></canvas>
    </section>
    <section id="results" class="overlay panel" hidden>
      <div class="eyebrow">THE CHECKERED FLAG</div>
      <h2 id="winner">Race results</h2>
      <div id="resultRows"></div>
      <button id="rematch" class="primary">RUN IT BACK ↻</button>
      <p id="resultWaiting" class="micro"></p>
      <button class="leave small">LEAVE ROOM</button>
    </section>
    <footer>
      <span class="live-dot"></span>
      <span>PALM CIRCUIT <b> / </b> COASTAL CLUB</span>
      <details>
        <summary>HOW TO DRIVE</summary>
        <p>
          <kbd>W ↑</kbd> Accelerate · <kbd>S ↓</kbd> Brake / reverse<br /><kbd
            >A ←</kbd
          >
          <kbd>D →</kbd> Steer · <kbd>SPACE</kbd> Drift ·
          <kbd>R</kbd> Reset<br />Follow the arrows. Pass the glowing checkpoint
          gates in order.<br />Opponents are ghost cars — clean racing, no
          blocking.
        </p>
      </details>
    </footer>
    <div id="toast" role="status" aria-live="polite"></div>
    <div id="touch" hidden>
      <button data-key="left">◀</button><button data-key="right">▶</button
      ><button data-key="down">BRAKE</button><button data-key="up">GAS</button
      ><button data-key="reset">RESET</button>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

````

## client/src/style.css

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/style.css`

````
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap");
:root {
  font-family: "DM Sans", sans-serif;
  color: #f2f4e9;
  background: #17392f;
  font-synthesis: none;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  overflow: hidden;
}
button,
input {
  font: inherit;
}
button {
  cursor: pointer;
  border: 1px solid #ffffff35;
  background: #ffffff0b;
  color: inherit;
  padding: 14px 18px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  transition: background 0.2s;
}
button:hover {
  background: #ffffff25;
}
button:disabled {
  opacity: 0.45;
  cursor: default;
}
button:focus-visible,
input:focus-visible {
  outline: 2px solid #d6fc71;
  outline-offset: 3px;
}
input {
  width: 100%;
  background: #0c211de0;
  border: 1px solid #ffffff30;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  outline: none;
}
input::placeholder {
  color: #91a29a;
}
#game {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: none;
}
body:before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    #071b17e8 0%,
    #0e201aad 29%,
    transparent 68%
  );
}
body.racing:before {
  background: none;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 40px;
  z-index: 3;
}
.brand {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 38px;
  font-weight: 800;
  font-style: italic;
  text-decoration: none;
  color: #fff;
  letter-spacing: -1px;
}
.brand > span {
  color: #d6fc71;
}
.brand small {
  display: inline-block;
  font-family: "DM Sans", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 9px;
  letter-spacing: 2px;
  max-width: 110px;
  margin-left: 16px;
  line-height: 1.5;
}
.top-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
#connection {
  font-size: 9px;
  letter-spacing: 1.5px;
  margin-right: 12px;
  color: #d6fc71;
}
.small {
  font-size: 10px;
  padding: 10px;
}
main {
  position: fixed;
  top: 17%;
  left: 7%;
  width: 440px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #d6fc71;
  font-weight: 700;
}
h1 {
  font-family: "Barlow Condensed", Impact, sans-serif;
  font-size: clamp(58px, 6.2vw, 92px);
  line-height: 0.95;
  letter-spacing: -2px;
  margin: 22px 0;
}
h1 em {
  color: #d6fc71;
  font-style: italic;
}
.intro {
  font-size: 14px;
  line-height: 1.8;
  color: #bdc9c0;
  margin: 20px 0 25px;
}
.panel {
  background: #11251fed;
  border: 1px solid #ffffff25;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 20px 60px #0003;
}
main .panel {
  max-width: 360px;
}
label {
  display: block;
  font-size: 9px;
  letter-spacing: 1.8px;
  color: #c0cbbb;
  margin-bottom: 10px;
}
.primary {
  background: #d6fc71;
  color: #15251c;
  border: 0;
  width: 100%;
  margin-top: 13px;
  padding: 17px;
  text-align: left;
}
.primary span {
  float: right;
}
.primary:hover {
  background: #e7ffa7;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: #8fa293;
  margin: 20px 0 15px;
}
.divider:before,
.divider:after {
  content: "";
  height: 1px;
  flex: 1;
  background: #ffffff20;
}
.join {
  display: flex;
  gap: 9px;
}
.join input {
  min-width: 0;
  letter-spacing: 2px;
}
.join button {
  white-space: nowrap;
}
.micro {
  color: #8fa293;
  font-size: 10px;
  text-align: center;
  margin: 16px 0 0;
}
.specs {
  display: flex;
  gap: 23px;
  margin-top: 24px;
  color: #d6fc71;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
}
.specs b {
  display: block;
  font-family: "DM Sans", sans-serif;
  letter-spacing: 1px;
  font-size: 8px;
  color: #a1b3a7;
  margin-top: 6px;
}
footer {
  position: fixed;
  bottom: 23px;
  left: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  letter-spacing: 1.4px;
  color: #dae3d4;
}
.live-dot {
  width: 6px;
  height: 6px;
  background: #d6fc71;
  border-radius: 50%;
}
footer b {
  color: #879e89;
  margin: 0 10px;
}
details {
  margin-left: auto;
  text-align: right;
}
summary {
  cursor: pointer;
}
details p {
  background: #10251eee;
  padding: 18px;
  line-height: 2.2;
  letter-spacing: 0;
  border-radius: 8px;
}
kbd {
  color: #d6fc71;
}
.overlay {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(440px, 92vw);
  max-height: 80vh;
  overflow: auto;
}
h2 {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 42px;
  line-height: 1;
  margin: 15px 0 25px;
}
.room-code {
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 9px;
  color: #d6fc71;
  margin-bottom: 15px;
}
#players {
  margin: 20px 0;
}
.player,
.result-row,
.leader-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #ffffff15;
  font-size: 13px;
}
.swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.badge {
  margin-left: auto;
  color: #d6fc71;
  font-size: 9px;
}
.leave {
  margin-top: 12px;
  width: 100%;
}
#toast {
  position: fixed;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  background: #eff7dc;
  color: #12251b;
  padding: 14px 22px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 10;
  display: none;
  max-width: 90vw;
}
.hud-top {
  position: fixed;
  top: 100px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  background: #10251ddd;
  padding: 18px 25px;
  border-radius: 8px;
}
.hud-top strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 30px;
}
.hud-top label {
  margin-bottom: 4px;
}
.hud-top .leave {
  width: auto;
  margin: 0;
}
#leaderboard {
  position: fixed;
  left: 40px;
  top: 230px;
  width: 220px;
  padding: 12px 20px;
}
.leader-row {
  font-size: 11px;
  justify-content: space-between;
}
.speed {
  position: fixed;
  right: 50px;
  bottom: 100px;
  text-align: right;
}
.speed strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 90px;
  line-height: 1;
}
.speed span {
  display: block;
  font-size: 11px;
  letter-spacing: 3px;
  color: #d6fc71;
}
#countdown {
  position: fixed;
  top: 35%;
  width: 100%;
  text-align: center;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 140px;
  color: #d6fc71;
  text-shadow: 0 4px 30px #0008;
  pointer-events: none;
}
#finishMessage {
  position: fixed;
  top: 27%;
  width: 100%;
  text-align: center;
  color: #d6fc71;
  font-size: 20px;
}
#minimap {
  position: fixed;
  right: 30px;
  top: 110px;
  background: #10251da8;
  border-radius: 10px;
}
.result-row span:last-child {
  margin-left: auto;
}
#touch {
  position: fixed;
  bottom: 70px;
  left: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  touch-action: none;
}
#touch button {
  background: #17392fe8;
  user-select: none;
  touch-action: none;
  flex: 1;
}
[hidden] {
  display: none !important;
}
@media (max-height: 850px) and (min-width: 701px) {
  main {
    top: 14%;
  }
  h1 {
    font-size: 66px;
    margin: 14px 0;
  }
  .intro {
    margin: 13px 0 18px;
  }
  .panel {
    padding: 19px;
  }
  .specs {
    margin-top: 16px;
  }
}
@media (max-width: 700px) {
  header {
    padding: 18px;
  }
  .brand small {
    display: none;
  }
  .top-right {
    gap: 4px;
  }
  #connection {
    font-size: 8px;
    margin: 0;
  }
  .small {
    padding: 8px;
    font-size: 8px;
  }
  main {
    top: 110px;
    left: 6%;
    width: 88%;
    max-height: calc(100dvh - 160px);
    overflow: auto;
  }
  h1 {
    font-size: 60px;
  }
  .intro {
    font-size: 12px;
  }
  main .panel {
    max-width: 340px;
  }
  .specs {
    margin-bottom: 20px;
  }
  footer {
    left: 18px;
    right: 18px;
    bottom: 18px;
    font-size: 7px;
  }
  body:before {
    background: #071b177a;
  }
  .hud-top {
    left: 15px;
    top: 80px;
    gap: 15px;
    padding: 12px;
  }
  .hud-top strong {
    font-size: 23px;
  }
  #leaderboard {
    left: 15px;
    top: 180px;
    width: 150px;
    padding: 8px 12px;
  }
  #minimap {
    width: 100px;
    height: 112px;
    right: 15px;
    top: 180px;
  }
  .speed {
    right: 20px;
    bottom: 140px;
  }
  .speed strong {
    font-size: 60px;
  }
  #countdown {
    font-size: 100px;
  }
}

body:before {
  z-index: 1;
}
main,
.overlay,
#hud,
footer,
#touch {
  z-index: 2;
}
#hud {
  position: relative;
}

````

## client/src/scene.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/scene.js`

````
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { TRACK, LENGTH, point, gates } from "../../shared/track.js";
export function createScene(canvas) {
  const engine = new Engine(canvas, true, {
    stencil: false,
    preserveDrawingBuffer: true,
  });
  engine.setHardwareScalingLevel(Math.max(1, devicePixelRatio / 1.5));
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.64, 0.79, 0.74, 1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0018;
  scene.fogColor = new Color3(0.64, 0.79, 0.74);
  new HemisphericLight("sky", new Vector3(0, 1, 0), scene).intensity = 0.65;
  const sun = new DirectionalLight("sun", new Vector3(-0.5, -1, 0.3), scene);
  sun.intensity = 0.7;
  const camera = new FreeCamera("camera", new Vector3(145, 105, -130), scene);
  camera.setTarget(new Vector3(10, 0, 0));
  camera.minZ = 0.1;
  camera.maxZ = 900;
  camera.fov = 0.85;
  function material(name, color) {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(color);
    m.specularColor = new Color3(0.15, 0.15, 0.15);
    return m;
  }
  const grass = material("sage grass", "#62846c"),
    road = material("warm asphalt", "#414d4d"),
    cream = material("ivory", "#ece8ca"),
    lime = material("acid yellow", "#d6fc71"),
    red = material("coral", "#df6b53"),
    dark = material("rubber", "#182525"),
    glass = material("smoked windows", "#275058"),
    bark = material("palm trunks", "#81735b"),
    leaf = material("palm fronds", "#376d51");
  function box(name, w, h, d, x, y, z, m, yaw = 0, parent) {
    const mesh = MeshBuilder.CreateBox(
      name,
      { width: w, height: h, depth: d },
      scene,
    );
    mesh.position.set(x, y, z);
    mesh.rotation.y = yaw;
    mesh.material = m;
    if (parent) mesh.parent = parent;
    return mesh;
  }
  box("island", 450, 0.5, 450, 0, -0.35, 0, grass);
  const edges = [-9, 9].map((offset) =>
    Array.from({ length: TRACK.segments + 1 }, (_, i) => {
      const p = point((i * LENGTH) / TRACK.segments, offset);
      return new Vector3(p.x, 0.08, p.z);
    }),
  );
  const surface = MeshBuilder.CreateRibbon(
    "road",
    { pathArray: edges, sideOrientation: 2 },
    scene,
  );
  surface.material = road;
  for (let i = 0; i < TRACK.segments; i++) {
    const p = point(((i + 0.5) * LENGTH) / TRACK.segments),
      len = LENGTH / TRACK.segments;

    for (const side of [-1, 1]) {
      const edge = point((i + 0.5) * len, side * 8.6),
        wall = point((i + 0.5) * len, side * 9.5);
      box(
        "curb",
        0.75,
        0.16,
        Math.hypot(
          point((i + 1) * len, side * 8.6).x - point(i * len, side * 8.6).x,
          point((i + 1) * len, side * 8.6).z - point(i * len, side * 8.6).z,
        ) * 0.998,
        edge.x,
        0.08,
        edge.z,
        i % 2 ? cream : red,
        p.yaw,
      );
      box(
        "barrier",
        1,
        1.4,
        Math.hypot(
          point((i + 1) * len, side * 9.5).x - point(i * len, side * 9.5).x,
          point((i + 1) * len, side * 9.5).z - point(i * len, side * 9.5).z,
        ) * 0.998,
        wall.x,
        0.7,
        wall.z,
        i % 6 < 3 ? cream : dark,
        p.yaw,
      );
    }
    if (i % 3 === 0)
      box("lane stripe", 0.16, 0.03, 1.5, p.x, 0.1, p.z, cream, p.yaw);
  }
  for (let i = 0; i < 12; i++) {
    const p = point(0, -8.25 + i * 1.5);
    for (let j = 0; j < 2; j++)
      box(
        "finish checker",
        1.5,
        0.04,
        1.4,
        p.x,
        0.13,
        p.z + j * 1.4,
        (i + j) % 2 ? dark : cream,
      );
  }
  box("gantry left", 0.7, 8, 0.7, 37, 4, 0, dark);
  box("gantry right", 0.7, 8, 0.7, 59, 4, 0, dark);
  box("start arch", 23, 2, 0.7, 48, 8, 0, lime);
  function sign(text, x, y, z, width = 16, height = 4, yaw = 0) {
    const tex = new DynamicTexture("sign", { width: 1024, height: 256 }, scene);
    tex.drawText(
      text,
      null,
      175,
      "bold 125px sans-serif",
      "#d6fc71",
      "#152b22",
      true,
    );
    const mat = material("sign material", "#ffffff");
    mat.diffuseTexture = tex;
    mat.emissiveColor = new Color3(0.2, 0.2, 0.2);
    const s = MeshBuilder.CreatePlane(
      "sign",
      { width, height, sideOrientation: 2 },
      scene,
    );
    s.position.set(x, y, z);
    s.rotation.y = yaw;
    s.material = mat;
    return s;
  }
  sign("APEX  /  START", 48, 8, -0.4, 20, 1.65);
  const gateMeshes = gates.map((p, i) => {
    const root = new TransformNode("checkpoint " + i, scene);
    for (const offset of [-7.8, 7.8])
      box("checkpoint post", 0.2, 3, 0.2, offset, 1.5, 0, lime, 0, root);
    root.position.set(p.x, 0, p.z);
    root.rotation.y = p.yaw;
    return root;
  });
  for (let i = 0; i < 12; i++) {
    const p = point((i * LENGTH) / 12 + 10);
    const arrow = sign("↑", p.x, 0.18, p.z, 2, 3, p.yaw);
    arrow.rotation.x = Math.PI / 2;
  }
  function palm(x, z, size = 1) {
    const trunk = MeshBuilder.CreateCylinder(
      "palm",
      {
        height: 7 * size,
        diameterTop: 0.35,
        diameterBottom: 0.6,
        tessellation: 7,
      },
      scene,
    );
    trunk.position.set(x, 3.5 * size, z);
    trunk.material = bark;
    for (let a = 0; a < 5; a++) {
      const frond = MeshBuilder.CreateSphere(
        "frond",
        { diameter: 1, segments: 5 },
        scene,
      );
      frond.scaling.set(1.4 * size, 0.35 * size, 5 * size);
      frond.rotation.y = (a * Math.PI * 2) / 5;
      frond.position.set(
        x + Math.sin(frond.rotation.y) * 1.7 * size,
        7 * size,
        z + Math.cos(frond.rotation.y) * 1.7 * size,
      );
      frond.material = leaf;
    }
  }
  for (let i = 0; i < 28; i++) {
    const p = point((i * LENGTH) / 28, 18 + (i % 3) * 6);
    palm(p.x, p.z, 0.9 + (i % 4) * 0.15);
  }
  for (let i = 0; i < 6; i++) palm(-17 + i * 7, 20 + (i % 2) * 15, 1.2);
  box("clubhouse", 23, 8, 13, -12, 4, -15, cream);
  box("club roof", 26, 0.7, 16, -12, 8.3, -15, red);
  box("club windows", 21, 3, 0.1, -12, 5, -21.55, glass);
  sign("PALM CLUB", -12, 9.8, -22, 19, 3);
  for (let i = 0; i < 4; i++)
    box(
      "grandstand",
      9,
      1 + i,
      30,
      -72,
      0.5 + i / 2,
      -10,
      i % 2 ? cream : dark,
    );
  const water = material("lagoon", "#599ca0");
  box("lagoon", 420, 0.1, 420, 0, -0.65, 0, water);
  const cars = new Map();
  function car(player) {
    const root = new TransformNode(player.id, scene),
      paint = material(player.id, player.color);
    box("body", 1.9, 0.65, 3.7, 0, 0.25, 0, paint, 0, root);
    box("hood", 1.8, 0.25, 1.3, 0, 0.62, 1, paint, 0, root);
    box("cabin", 1.5, 0.65, 1.65, 0, 0.86, -0.25, glass, 0, root);
    box("roof", 1.6, 0.12, 1.1, 0, 1.2, -0.35, paint, 0, root);
    box("spoiler", 2.15, 0.12, 0.35, 0, 0.9, -1.65, dark, 0, root);
    for (const x of [-0.63, 0.63]) {
      box("headlight", 0.48, 0.18, 0.06, x, 0.44, 1.88, cream, 0, root);
      box("taillight", 0.48, 0.15, 0.06, x, 0.43, -1.88, red, 0, root);
    }
    const wheels = [];
    for (const x of [-1, 1])
      for (const z of [-1.15, 1.15]) {
        const pivot = new TransformNode("wheel pivot", scene);
        pivot.parent = root;
        pivot.position.set(x, -0.05, z);
        const axle = new TransformNode("spinning axle", scene);
        axle.parent = pivot;
        const wheel = MeshBuilder.CreateCylinder(
          "wheel",
          { diameter: 0.72, height: 0.35, tessellation: 12 },
          scene,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.parent = axle;
        wheel.material = dark;
        box("wheel spoke", 0.03, 0.48, 0.1, x * 0.18, 0, 0, cream, 0, axle);
        box("wheel spoke", 0.03, 0.1, 0.48, x * 0.18, 0, 0, cream, 0, axle);
        wheels.push({ pivot, wheel: axle, front: z > 0 });
      }
    const label = sign(player.name, 0, 2.5, 0, 3.5, 0.85);
    label.parent = root;
    label.billboardMode = 7;
    const result = {
      root,
      wheels,
      target: null,
      dispose: () => {
        root.dispose();
        paint.dispose();
        label.material.dispose(false, true);
      },
    };
    cars.set(player.id, result);
    return result;
  }
  let targets = [],
    me = null,
    racing = false,
    last = performance.now();
  function update(state, id) {
    targets = state.cars;
    me = id;
    racing = ["countdown", "racing", "results"].includes(state.phase);
    for (const p of state.players) if (!cars.has(p.id)) car(p);
    for (const [id, c] of cars)
      if (!state.players.some((p) => p.id === id)) {
        c.dispose();
        cars.delete(id);
      }
    for (const t of targets) {
      const c = cars.get(t.id);
      if (c && !c.target) c.root.position.set(t.x, t.y, t.z);
      if (c) c.target = t;
    }
    const mine = targets.find((c) => c.id === me);
    gateMeshes.forEach((g, i) =>
      g.setEnabled(!!mine && i === (mine.passed + 1) % 24),
    );
  }
  engine.runRenderLoop(() => {
    const now = performance.now(),
      dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    for (const c of cars.values()) {
      const t = c.target;
      if (!t) continue;
      const alpha = 1 - Math.exp(-14 * dt);
      const dest = new Vector3(t.x, t.y, t.z);
      if (Vector3.Distance(c.root.position, dest) > 12)
        c.root.position.copyFrom(dest);
      else c.root.position = Vector3.Lerp(c.root.position, dest, alpha);
      const d = Math.atan2(
        Math.sin(t.yaw - c.root.rotation.y),
        Math.cos(t.yaw - c.root.rotation.y),
      );
      c.root.rotation.y += d * alpha;
      for (const w of c.wheels) {
        w.wheel.rotation.x += (t.speed * dt) / 0.36;
        w.pivot.rotation.y = w.front ? t.steer * 0.35 : 0;
      }
    }
    const mine = cars.get(me);
    if (racing && mine) {
      const p = mine.root.position,
        yaw = mine.root.rotation.y;
      const desired = new Vector3(
        p.x - Math.sin(yaw) * 12,
        p.y + 6,
        p.z - Math.cos(yaw) * 12,
      );
      camera.position = Vector3.Lerp(
        camera.position,
        desired,
        1 - Math.exp(-5 * dt),
      );
      camera.setTarget(
        new Vector3(p.x + Math.sin(yaw) * 5, p.y + 1, p.z + Math.cos(yaw) * 5),
      );
    } else {
      const t = now * 0.000025;
      camera.position.set(130 + Math.sin(t) * 15, 100, -110 + Math.cos(t) * 15);
      camera.setTarget(new Vector3(7, 0, 4));
    }
    scene.render();
  });
  window.addEventListener("resize", () => engine.resize());
  return {
    update,
    quality: (low) =>
      engine.setHardwareScalingLevel(
        low ? 2 : Math.max(1, devicePixelRatio / 1.5),
      ),
    scene,
  };
}

````

## client/src/main.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/client/src/main.js`

````
import "./style.css";
import { io } from "socket.io-client";
import { createScene } from "./scene.js";
import { TRACK, LENGTH, point } from "../../shared/track.js";
const $ = (id) => document.getElementById(id),
  socket = io(),
  keys = {},
  map = $("minimap").getContext("2d");
let view,
  state,
  offset = 0,
  toastTimer,
  audio,
  osc,
  gain,
  sound = false,
  lastCountdown = "",
  lastPhase = "",
  low = false;
function notice(text) {
  $("toast").textContent = text;
  $("toast").style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("toast").style.display = "none"), 4500);
}
try {
  view = createScene($("game"));
} catch (e) {
  notice(
    "3D could not start. Enable browser hardware acceleration and reload.",
  );
  console.error(e);
}
function beep(freq = 600, duration = 0.12) {
  if (!sound || !audio) return;
  const o = audio.createOscillator(),
    g = audio.createGain();
  o.connect(g);
  g.connect(audio.destination);
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.06, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  o.start();
  o.stop(audio.currentTime + duration);
}
$("sound").onclick = () => {
  sound = !sound;
  if (sound && !audio) {
    audio = new AudioContext();
    osc = audio.createOscillator();
    gain = audio.createGain();
    osc.type = "sawtooth";
    osc.connect(gain);
    gain.connect(audio.destination);
    gain.gain.value = 0;
    osc.start();
  }
  audio?.resume();
  $("sound").textContent = sound ? "SOUND ON" : "SOUND OFF";
  if (!sound && gain) gain.gain.value = 0;
};
$("quality").onclick = () => {
  low = !low;
  view?.quality(low);
  $("quality").textContent = low ? "QUALITY LOW" : "QUALITY HIGH";
};
const invite = new URLSearchParams(location.search).get("room");
if (invite) $("code").value = invite.toUpperCase().slice(0, 5);
function request(event, data = {}) {
  return new Promise((resolve) => {
    if (!socket.connected) {
      notice("Connecting to server. Please wait and try again.");
      return resolve(false);
    }
    socket.timeout(5000).emit(event, data, (err, result) => {
      if (err || !result?.ok) {
        notice(result?.error || "Server did not respond. Please try again.");
        resolve(false);
      } else resolve(result);
    });
  });
}
$("create").onclick = () =>
  request("enter", { name: $("nickname").value, create: true });
$("join").onclick = () =>
  request("enter", {
    name: $("nickname").value,
    code: $("code").value.trim().toUpperCase(),
  });
$("start").onclick = () => request("start");
$("rematch").onclick = () => request("rematch");
document.querySelectorAll(".leave").forEach(
  (b) =>
    (b.onclick = async () => {
      if (await request("leave")) {
        state = null;
        render();
        view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
        history.replaceState(null, "", location.pathname);
      }
    }),
);
$("copy").onclick = async () => {
  const url = new URL(location.href);
  url.searchParams.set("room", state.code);
  try {
    await navigator.clipboard.writeText(url.href);
    notice("Invite link copied. Send it to your friends!");
  } catch {
    notice("Copy the address bar to share your room.");
  }
};
socket.on("connect", () => {
  $("connection").textContent = "● ONLINE";
});
socket.on("disconnect", () => {
  $("connection").textContent = "RECONNECTING";
  state = null;
  for (const k in keys) keys[k] = false;
  render();
  view?.update({ cars: [], players: [], phase: "lobby" }, socket.id);
  notice(
    "Disconnected. When connected, rejoin the lobby with your code. An active race cannot be rejoined.",
  );
});
socket.on("connect_error", () => {
  $("connection").textContent = "SERVER UNAVAILABLE";
  notice(
    "Server unavailable or waking up. Wait a minute; connection retries automatically.",
  );
});
socket.on("notice", notice);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const time = (ms) => {
  const s = Math.max(0, ms) / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};
const ordered = () =>
  [...state.cars].sort((a, b) =>
    a.finished !== null && b.finished !== null
      ? a.finished - b.finished
      : a.finished !== null
        ? -1
        : b.finished !== null
          ? 1
          : b.progress - a.progress,
  );
function render() {
  const phase = state?.phase;
  document.body.classList.toggle("racing", !!state && phase !== "lobby");
  $("home").hidden = !!state;
  $("lobby").hidden = phase !== "lobby";
  $("results").hidden = phase !== "results";
  $("hud").hidden = !["countdown", "racing"].includes(phase);
  $("touch").hidden =
    !["countdown", "racing"].includes(phase) ||
    !matchMedia("(pointer:coarse)").matches;
  if (!state) return;
  const host = state.host === socket.id;
  $("roomCode").textContent = state.code;
  $("players").innerHTML = state.players
    .map(
      (p) =>
        `<div class="player"><i class="swatch" style="background:${p.color}"></i>${esc(p.name)}<span class="badge">${p.id === state.host ? "HOST" : "DRIVER"}</span></div>`,
    )
    .join("");
  $("start").hidden = !host;
  $("start").disabled = state.players.length < 2;
  $("waiting").textContent =
    `${state.players.length} / 6 drivers · ` +
    (host
      ? state.players.length < 2
        ? "Invite a friend to start."
        : "Everyone in? Start when ready."
      : "Waiting for host to start…");
  const rows = ordered(),
    player = (id) => state.players.find((p) => p.id === id);
  $("leaderboard").innerHTML = rows
    .map(
      (c, i) =>
        `<div class="leader-row"><span>${i + 1}　${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? "FIN" : "L" + Math.min(3, Math.floor(c.passed / 24) + 1)}</span></div>`,
    )
    .join("");
  if (phase === "results") {
    $("winner").textContent =
      rows[0]?.finished !== null
        ? `${player(rows[0]?.id)?.name} takes the win.`
        : "Time’s up!";
    $("resultRows").innerHTML = rows
      .map(
        (c, i) =>
          `<div class="result-row"><b>${i + 1}</b><i class="swatch" style="background:${player(c.id)?.color}"></i><span>${esc(player(c.id)?.name)}</span><span>${c.finished !== null ? time(c.finished) : "DNF"}</span></div>`,
      )
      .join("");
    $("rematch").hidden = !host;
    $("resultWaiting").textContent = host
      ? "New grid. Same friends."
      : "Waiting for host to rematch…";
  }
}
socket.on("state", (s) => {
  if (!s || !Array.isArray(s.cars) || !Array.isArray(s.players)) return;
  state = s;
  offset = s.serverNow - Date.now();
  view?.update(s, socket.id);
  if (lastPhase !== s.phase) {
    if (s.phase === "results") beep(900, 0.6);
    lastPhase = s.phase;
  }
  render();
  if (s.phase === "lobby") {
    const url = new URL(location.href);
    url.searchParams.set("room", s.code);
    history.replaceState(null, "", url);
  }
});
const bindings = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "drift",
  KeyR: "reset",
};
window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const key = bindings[e.code];
  if (key && state) {
    e.preventDefault();
    keys[key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (bindings[e.code]) keys[bindings[e.code]] = false;
});
window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) for (const k in keys) keys[k] = false;
});
document.querySelectorAll("[data-key]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys[b.dataset.key] = true;
  };
  b.onpointerup =
    b.onpointercancel =
    b.onlostpointercapture =
      () => (keys[b.dataset.key] = false);
});
setInterval(() => {
  if (state && socket.connected) socket.volatile.emit("input", keys);
}, 1000 / 30);
function frame() {
  requestAnimationFrame(frame);
  if (!state) {
    if (gain) gain.gain.value = 0;
    return;
  }
  const c = state.cars.find((c) => c.id === socket.id);
  if (!c) return;
  const now = Date.now() + offset,
    elapsed = now - state.startAt;
  const count =
    state.phase === "countdown"
      ? String(Math.max(1, Math.ceil(-elapsed / 1000)))
      : state.phase === "racing" && elapsed < 1000
        ? "GO!"
        : "";
  $("countdown").textContent = count;
  if (count !== lastCountdown) {
    if (count) beep(count === "GO!" ? 900 : 500);
    lastCountdown = count;
  }
  $("lap").textContent = `${Math.min(3, Math.floor(c.passed / 24) + 1)} / 3`;
  $("position").textContent =
    `${ordered().findIndex((p) => p.id === c.id) + 1} / ${state.players.length}`;
  $("speed").textContent = Math.round(c.speed * 3.6);
  $("timer").textContent = time(c.finished ?? elapsed);
  $("finishMessage").textContent =
    c.finished !== null
      ? "FINISHED · Waiting for the rest of the grid"
      : state.endAt
        ? `Finish window: ${Math.max(0, Math.ceil((state.endAt - now) / 1000))}s`
        : "";
  if (sound && gain) {
    gain.gain.value =
      state.phase === "racing" && c.finished === null ? 0.018 : 0;
    osc.frequency.setTargetAtTime(40 + c.speed * 3, audio.currentTime, 0.1);
  }
  map.clearRect(0, 0, 180, 200);
  map.beginPath();
  for (let i = 0; i <= 120; i++) {
    const p = point((i * LENGTH) / 120);
    map.lineTo(90 + p.x * 0.75, 100 + p.z * 0.75);
  }
  map.strokeStyle = "#b1c4a477";
  map.lineWidth = 13;
  map.stroke();
  for (const p of state.players) {
    const t = state.cars.find((c) => c.id === p.id);
    if (!t) continue;
    map.fillStyle = p.color;
    map.beginPath();
    map.arc(
      90 + t.x * 0.75,
      100 + t.z * 0.75,
      p.id === socket.id ? 4.5 : 3,
      0,
      Math.PI * 2,
    );
    map.fill();
  }
}
frame();

````

## shared/track.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/shared/track.js`

````
export const TRACK = {
  name: "Palm Circuit",
  width: 18,
  laps: 3,
  maxPlayers: 6,
  segments: 120,
};
// A stadium loop: long straights connected by semicircles. Travel clockwise.
export const LENGTH = 160 + 2 * Math.PI * 48;
export function point(s, offset = 0) {
  s = ((s % LENGTH) + LENGTH) % LENGTH;
  let x, z, yaw;
  if (s < 80) {
    x = 48;
    z = -40 + s;
    yaw = 0;
  } else if (s < 80 + Math.PI * 48) {
    const a = (s - 80) / 48;
    x = 48 * Math.cos(a);
    z = 40 + 48 * Math.sin(a);
    yaw = -a;
  } else if (s < 160 + Math.PI * 48) {
    x = -48;
    z = 40 - (s - 80 - Math.PI * 48);
    yaw = -Math.PI;
  } else {
    const a = (s - 160 - Math.PI * 48) / 48;
    x = -48 * Math.cos(a);
    z = -40 - 48 * Math.sin(a);
    yaw = -Math.PI - a;
  }
  return { x: x + Math.cos(yaw) * offset, z: z - Math.sin(yaw) * offset, yaw };
}
export function nearest(x, z) {
  let s;
  if (z > 40) {
    let a = Math.atan2(z - 40, x);
    s = 80 + 48 * a;
  } else if (z < -40) {
    let a = Math.atan2(-z - 40, -x);
    s = 160 + Math.PI * 48 + 48 * a;
  } else s = x >= 0 ? z + 40 : 80 + Math.PI * 48 + 40 - z;
  const p = point(s);
  return { s, distance: Math.hypot(x - p.x, z - p.z) };
}
export const gates = Array.from({ length: 24 }, (_, i) =>
  point((i * LENGTH) / 24),
);

````

## server/race.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/server/race.js`

````
import * as C from "cannon-es";
import { TRACK, LENGTH, point, nearest, gates } from "../shared/track.js";
export class Race {
  constructor() {
    this.world = new C.World({ gravity: new C.Vec3(0, -18, 0) });
    this.world.defaultContactMaterial.friction = 0;
    const ground = new C.Body({ mass: 0, shape: new C.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(ground);
    for (let i = 0; i < TRACK.segments; i++)
      for (const side of [-1, 1]) {
        const p = point(
          ((i + 0.5) * LENGTH) / TRACK.segments,
          side * (TRACK.width / 2 + 0.5),
        );
        const b = new C.Body({
          mass: 0,
          shape: new C.Box(
            new C.Vec3(0.5, 1.2, (LENGTH / TRACK.segments) * 0.57),
          ),
          position: new C.Vec3(p.x, 1, p.z),
        });
        b.quaternion.setFromEuler(0, p.yaw, 0);
        this.world.addBody(b);
      }
    this.cars = new Map();
  }
  add(id, index) {
    const b = new C.Body({
      mass: 150,
      shape: new C.Box(new C.Vec3(0.9, 0.45, 1.8)),
      fixedRotation: true,
      linearDamping: 0,
    });
    b.updateMassProperties();
    // Ghost opponents prevent griefing; barriers and ground remain physical.
    b.collisionFilterGroup = 2;
    b.collisionFilterMask = 1;
    const car = {
      id,
      b,
      yaw: 0,
      steer: 0,
      input: {},
      inputAt: 0,
      passed: 0,
      finished: null,
      resetAt: 0,
    };
    this.cars.set(id, car);
    this.world.addBody(b);
    this.reset(car, true, index);
    return car;
  }
  remove(id) {
    const c = this.cars.get(id);
    if (c) this.world.removeBody(c.b);
    this.cars.delete(id);
  }
  reset(c, grid = false, index = 0) {
    const s = grid ? -7 - Math.floor(index / 2) * 6 : (c.passed * LENGTH) / 24;
    const p = point(s, grid ? (index % 2 ? 2.5 : -2.5) : 0);
    c.b.position.set(p.x, 0.55, p.z);
    c.b.velocity.setZero();
    c.b.angularVelocity.setZero();
    c.yaw = p.yaw;
    c.b.quaternion.setFromEuler(0, c.yaw, 0);
    c.previous = { x: p.x, z: p.z };
  }
  step(dt, now, running, startAt) {
    for (const c of this.cars.values()) {
      const input =
        running && !c.finished && now - c.inputAt < 500 ? c.input : {};
      if (input.reset && now - c.resetAt > 2000) {
        this.reset(c);
        c.resetAt = now;
      }
      const f = { x: Math.sin(c.yaw), z: Math.cos(c.yaw) },
        v = c.b.velocity;
      let speed = v.x * f.x + v.z * f.z;
      const lateral = v.x * f.z - v.z * f.x;
      c.steer = (input.left ? -1 : 0) + (input.right ? 1 : 0);
      let throttle = (input.up ? 1 : 0) - (input.down ? 1 : 0);
      speed += throttle * (throttle * speed < 0 ? 38 : 22) * dt;
      speed *= Math.exp(-(input.drift ? 0.6 : 0.22) * dt);
      speed = Math.max(-12, Math.min(48, speed));
      if (!running || c.finished) speed *= Math.exp(-8 * dt);
      c.yaw +=
        c.steer *
        Math.sign(speed) *
        Math.min(Math.abs(speed) / 12, 1) *
        (input.drift ? 2.1 : 1.25) *
        dt;
      const slip = lateral * Math.exp(-(input.drift ? 1.8 : 9) * dt);
      v.x = Math.sin(c.yaw) * speed + Math.cos(c.yaw) * slip;
      v.z = Math.cos(c.yaw) * speed - Math.sin(c.yaw) * slip;
      c.b.quaternion.setFromEuler(0, c.yaw, 0);
      c.previous = { x: c.b.position.x, z: c.b.position.z };
    }
    this.world.step(dt);
    for (const c of this.cars.values()) {
      if (running && !c.finished) this.progress(c, now, startAt);
      if (
        c.b.position.y < -5 ||
        nearest(c.b.position.x, c.b.position.z).distance > 30
      )
        this.reset(c);
    }
  }
  progress(c, now, startAt) {
    const next = (c.passed + 1) % 24,
      g = gates[next],
      p = c.b.position,
      old = c.previous;
    const before =
      (old.x - g.x) * Math.sin(g.yaw) + (old.z - g.z) * Math.cos(g.yaw);
    const after = (p.x - g.x) * Math.sin(g.yaw) + (p.z - g.z) * Math.cos(g.yaw);
    const across = Math.abs(
      (p.x - g.x) * Math.cos(g.yaw) - (p.z - g.z) * Math.sin(g.yaw),
    );
    if (before <= 0 && after > 0 && across < TRACK.width / 2 + 1) {
      c.passed++;
      if (c.passed === 24 * TRACK.laps) c.finished = now - startAt;
    }
  }
  snapshot() {
    return [...this.cars.values()].map((c) => ({
      id: c.id,
      x: c.b.position.x,
      y: c.b.position.y,
      z: c.b.position.z,
      yaw: c.yaw,
      speed: Math.hypot(c.b.velocity.x, c.b.velocity.z),
      steer: c.steer,
      passed: c.passed,
      finished: c.finished,
      progress:
        c.passed +
        Math.min(
          0.99,
          Math.max(
            -1,
            (((((nearest(c.b.position.x, c.b.position.z).s -
              ((c.passed % 24) * LENGTH) / 24 +
              LENGTH / 2) %
              LENGTH) +
              LENGTH) %
              LENGTH) -
              LENGTH / 2) /
              (LENGTH / 24),
          ),
        ),
    }));
  }
}

````

## server/index.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/server/index.js`

````
import express from "express";
import { createServer } from "node:http";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { Race } from "./race.js";
import { TRACK } from "../shared/track.js";
export async function createGame({ dev = false } = {}) {
  const app = express(),
    http = createServer(app),
    io = new Server(http, { maxHttpBufferSize: 2048 }),
    rooms = new Map();
  app.get("/health", (_req, res) => res.json({ ok: true }));
  let vite;
  if (dev) {
    vite = await (
      await import("vite")
    ).createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else
    app.use(express.static(fileURLToPath(new URL("../dist", import.meta.url))));
  const colors = [
    "#ff584d",
    "#43c9ff",
    "#b5f363",
    "#ffcf57",
    "#c999ff",
    "#ff8dc7",
  ];
  const state = (r) => ({
    code: r.code,
    host: r.host,
    phase: r.phase,
    startAt: r.startAt,
    serverNow: Date.now(),
    players: [...r.players.values()],
    cars: r.race.snapshot(),
    endAt: r.endAt,
  });
  function broadcast(r) {
    io.to(r.code).emit("state", state(r));
  }
  function leave(s) {
    const r = rooms.get(s.data.room);
    if (!r) return;
    const p = r.players.get(s.id);
    r.players.delete(s.id);
    r.race.remove(s.id);
    s.leave(r.code);
    s.data.room = null;
    if (!r.players.size) {
      rooms.delete(r.code);
      return;
    }
    if (r.host === s.id) r.host = r.players.keys().next().value;
    io.to(r.code).emit("notice", `${p?.name || "Player"} disconnected`);
    broadcast(r);
  }
  io.on("connection", (s) => {
    let requests = 0,
      windowAt = Date.now();
    s.use((_packet, next) => {
      if (Date.now() - windowAt > 1000) {
        windowAt = Date.now();
        requests = 0;
      }
      if (++requests > 70) return next(new Error("Slow down"));
      next();
    });
    const action = (event, fn) =>
      s.on(event, (data, ack) => {
        try {
          const result = fn(data);
          if (typeof ack === "function") ack({ ok: true, ...result });
        } catch (e) {
          if (typeof ack === "function")
            ack({ ok: false, error: e.message || "Request failed" });
        }
      });
    action("enter", (data) => {
      if (!data || typeof data !== "object") throw Error("Enter a nickname.");
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (name.length < 1 || name.length > 18 || /[\x00-\x1f]/.test(name))
        throw Error("Use a nickname of 1–18 characters.");
      if (s.data.room) throw Error("Leave your current room first.");
      let r;
      if (data.create === true) {
        if (rooms.size >= 100) throw Error("Server is full. Try later.");
        let code;
        do {
          code = Array.from(
            { length: 5 },
            () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[randomInt(31)],
          ).join("");
        } while (rooms.has(code));
        r = {
          code,
          host: s.id,
          phase: "lobby",
          players: new Map(),
          race: new Race(),
          startAt: 0,
          endAt: 0,
        };
        rooms.set(code, r);
      } else {
        if (typeof data.code !== "string" || !/^[A-Z2-9]{5}$/.test(data.code))
          throw Error("Enter a valid 5-character room code.");
        r = rooms.get(data.code);
        if (!r) throw Error("Room not found. Ask your friend for a new code.");
      }
      if (r.phase !== "lobby")
        throw Error("Race in progress. Join after the rematch.");
      if (r.players.size >= 6) throw Error("Room is full (6 players).");
      const color = colors.find(
        (c) => ![...r.players.values()].some((p) => p.color === c),
      );
      r.players.set(s.id, { id: s.id, name, color });
      r.race.add(s.id, r.players.size - 1);
      s.data.room = r.code;
      s.join(r.code);
      io.to(r.code).emit("notice", `${name} joined the race`);
      broadcast(r);
      return { code: r.code };
    });
    action("start", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id) throw Error("Only the host can start.");
      if (r.phase !== "lobby" || r.players.size < 2)
        throw Error("You need at least 2 players.");
      r.race = new Race();
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      r.phase = "countdown";
      r.startAt = Date.now() + 3000;
      r.endAt = 0;
      broadcast(r);
    });
    action("rematch", () => {
      const r = rooms.get(s.data.room);
      if (!r || r.host !== s.id || r.phase !== "results")
        throw Error("Only the host can rematch after results.");
      r.phase = "lobby";
      r.race = new Race();
      [...r.players.keys()].forEach((id, i) => r.race.add(id, i));
      broadcast(r);
    });
    action("leave", () => leave(s));
    s.on("input", (data) => {
      const c = rooms.get(s.data.room)?.race.cars.get(s.id);
      if (!c || !data || typeof data !== "object") return;
      c.input = Object.fromEntries(
        ["up", "down", "left", "right", "drift", "reset"].map((k) => [
          k,
          data[k] === true,
        ]),
      );
      c.inputAt = Date.now();
    });
    s.on("disconnect", () => leave(s));
  });
  let ticks = 0;
  const interval = setInterval(() => {
    const now = Date.now();
    for (const r of rooms.values()) {
      if (r.phase === "countdown" && now >= r.startAt) r.phase = "racing";
      r.race.step(1 / 60, now, r.phase === "racing", r.startAt);
      if (r.phase === "racing") {
        const cars = [...r.race.cars.values()];
        if (cars.some((c) => c.finished) && !r.endAt) r.endAt = now + 60000;
        if (
          cars.every((c) => c.finished) ||
          (r.endAt && now >= r.endAt) ||
          now - r.startAt > 600000
        )
          r.phase = "results";
      }
      if (ticks % 3 === 0) broadcast(r);
    }
    ticks++;
  }, 1000 / 60);
  return {
    http,
    io,
    rooms,
    close: async () => {
      clearInterval(interval);
      await vite?.close();
      await new Promise((resolve) => io.close(resolve));
    },
  };
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const game = await createGame({ dev: process.argv.includes("--dev") });
  game.http.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () =>
    console.log("APEX racing: http://localhost:" + (process.env.PORT || 3000)),
  );
}

````

## test/race.test.js

Exact workspace path: `C:/Users/jadav/Coding/car racing game/test/race.test.js`

````
import { test } from "node:test";
import assert from "node:assert/strict";
import { io } from "socket.io-client";
import { Race } from "../server/race.js";
import { createGame } from "../server/index.js";
import { point, LENGTH, nearest } from "../shared/track.js";
test("track is continuous and nearest recovers distance", () => {
  for (let s = 0; s < LENGTH; s += 0.7) {
    const p = point(s);
    assert.ok(Math.abs(nearest(p.x, p.z).s - s) < 0.001);
  }
  assert.ok(
    Math.hypot(
      point(-0.001).x - point(0.001).x,
      point(-0.001).z - point(0.001).z,
    ) < 0.003,
  );
});
test("server physics accelerates, brakes, reverses, collides and remains grounded", () => {
  const r = new Race(),
    c = r.add("a", 0);
  let now = 10000;
  const initialZ = c.b.position.z;
  c.input = { up: true };
  for (let i = 0; i < 100; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.z > initialZ + 10);
  assert.ok(c.b.position.y > 0.3 && c.b.position.y < 0.7);
  c.input = { down: true };
  for (let i = 0; i < 220; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.velocity.z < 0);
  c.b.position.set(54, 0.55, 0);
  c.yaw = Math.PI / 2;
  c.input = { up: true };
  for (let i = 0; i < 180; i++) {
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.ok(c.b.position.x < 57.5, "barrier contains car");
});
test("checkpoints reject skips/backward crossings; 3 ordered laps finish", () => {
  const r = new Race(),
    c = r.add("a", 0);
  function cross(n, back = false) {
    const s = (n * LENGTH) / 24,
      a = point(s - (back ? -1 : 1)),
      b = point(s + (back ? -1 : 1));
    c.previous = a;
    c.b.position.set(b.x, 0.5, b.z);
    r.progress(c, 10000 + n * 100, 10000);
  }
  cross(3);
  assert.equal(c.passed, 0);
  cross(1, true);
  assert.equal(c.passed, 0);
  for (let n = 1; n <= 72; n++) cross(n);
  assert.equal(c.passed, 72);
  assert.equal(c.finished, 7200);
  r.reset(c);
  assert.equal(c.passed, 72);
});
test("stale inputs stop accelerating and lobby ignores inputs", () => {
  const r = new Race(),
    c = r.add("a", 0);
  c.input = { up: true };
  c.inputAt = 0;
  r.step(1 / 60, 10000, true, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
  c.inputAt = 10000;
  r.step(1 / 60, 10000, false, 0);
  assert.ok(Math.abs(c.b.velocity.z) < 0.01);
});
test("a car can physically drive three complete laps through every checkpoint", () => {
  const r = new Race(),
    c = r.add("driver", 0);
  let now = 10000;
  for (let i = 0; i < 18000 && !c.finished; i++) {
    const p = c.b.position,
      target = point(nearest(p.x, p.z).s + 10),
      desired = Math.atan2(target.x - p.x, target.z - p.z),
      error = Math.atan2(Math.sin(desired - c.yaw), Math.cos(desired - c.yaw));
    c.input = { up: true, left: error < -0.045, right: error > 0.045 };
    c.inputAt = now;
    r.step(1 / 60, now, true, 10000);
    now += 1000 / 60;
  }
  assert.equal(c.passed, 72);
  assert.ok(c.finished > 10000 && c.finished < 300000);
});
test("real Socket.IO clients: validation, isolation, host authority, movement, results, rematch, cleanup", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${game.http.address().port}`,
    clients = [];
  t.after(async () => {
    clients.forEach((s) => s.disconnect());
    await game.close();
  });
  async function connect() {
    const s = io(url, { forceNew: true, transports: ["websocket"] });
    clients.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
    return s;
  }
  const a = await connect(),
    b = await connect(),
    c = await connect();
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  assert.equal((await send(a, "enter", null)).ok, false);
  assert.equal(
    (await send(a, "enter", { name: "x".repeat(19), create: true })).ok,
    false,
  );
  assert.equal(
    (await send(b, "enter", { name: "B", code: "AAAAA" })).ok,
    false,
  );
  const created = await send(a, "enter", { name: "Alpha", create: true });
  assert.equal(created.ok, true);
  const room = game.rooms.get(created.code);
  assert.equal((await send(a, "start")).ok, false);
  assert.equal(
    (await send(b, "enter", { name: "Bravo", code: created.code })).ok,
    true,
  );
  await send(c, "enter", { name: "Other", create: true });
  assert.equal((await send(b, "start")).ok, false);
  assert.equal((await send(a, "start")).ok, true);
  assert.equal(room.phase, "countdown");
  assert.equal(
    (await send(c, "enter", { name: "No", code: created.code })).ok,
    false,
  );
  room.startAt = Date.now() - 1000;
  let bState;
  b.on("state", (s) => (bState = s));
  const initial = room.race.cars.get(a.id).b.position.z;
  for (let i = 0; i < 8; i++) {
    a.emit("input", { up: true });
    await new Promise((r) => setTimeout(r, 50));
  }
  assert.ok(room.race.cars.get(a.id).b.position.z > initial);
  assert.ok(bState.cars.find((p) => p.id === a.id).z > initial);
  assert.equal(bState.players.length, 2);
  room.race.cars.get(a.id).finished = 1200;
  room.race.cars.get(b.id).finished = 1500;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(room.phase, "results");
  assert.equal((await send(b, "rematch")).ok, false);
  assert.equal((await send(a, "rematch")).ok, true);
  assert.equal(room.phase, "lobby");
  assert.equal(room.race.cars.get(a.id).passed, 0);
  const aid = a.id,
    bid = b.id;
  await send(a, "leave");
  assert.equal(room.host, bid);
  assert.ok(!room.players.has(aid));
  await send(b, "leave");
  assert.ok(!game.rooms.has(created.code));
});
test("six-player cap, spoof resistance, real disconnect host transfer and finish timeout", async (t) => {
  const game = await createGame();
  await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
  const sockets = [];
  t.after(async () => {
    sockets.forEach((s) => s.disconnect());
    await game.close();
  });
  const send = (s, e, d = {}) =>
    new Promise((resolve, reject) =>
      s.timeout(2000).emit(e, d, (err, r) => (err ? reject(err) : resolve(r))),
    );
  for (let i = 0; i < 7; i++) {
    const s = io(`http://127.0.0.1:${game.http.address().port}`, {
      forceNew: true,
    });
    sockets.push(s);
    await new Promise((resolve) => s.on("connect", resolve));
  }
  const { code } = await send(sockets[0], "enter", {
    name: "Host",
    create: true,
  });
  for (let i = 1; i < 6; i++)
    assert.equal(
      (await send(sockets[i], "enter", { name: "Driver" + i, code })).ok,
      true,
    );
  assert.equal(
    (await send(sockets[6], "enter", { name: "Seventh", code })).ok,
    false,
  );
  const room = game.rooms.get(code);
  assert.equal(new Set([...room.players.values()].map((p) => p.color)).size, 6);
  await send(sockets[0], "start");
  room.startAt = Date.now() - 1000;
  sockets[1].emit("input", { x: 99999, passed: 72, finished: 1, up: "yes" });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.race.cars.get(sockets[1].id).passed, 0);
  assert.equal(room.race.cars.get(sockets[1].id).finished, null);
  const next = sockets[1].id;
  sockets[0].disconnect();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.host, next);
  assert.equal(room.players.size, 5);
  room.race.cars.get(next).finished = 5000;
  await new Promise((r) => setTimeout(r, 50));
  assert.ok(room.endAt > Date.now());
  room.endAt = Date.now() - 1;
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(room.phase, "results");
  assert.ok(room.race.snapshot().some((c) => c.finished === null));
});

````

## scripts/browser-check.mjs

Exact workspace path: `C:/Users/jadav/Coding/car racing game/scripts/browser-check.mjs`

````
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createGame } from "../server/index.js";
const game = await createGame();
await new Promise((resolve) => game.http.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${game.http.address().port}`;
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  a = await context.newPage(),
  b = await context.newPage(),
  errors = [];
for (const p of [a, b]) p.on("pageerror", (e) => errors.push(e.message));
await mkdir("test-artifacts", { recursive: true });
try {
  await a.goto(base);
  await a.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await a.waitForTimeout(2500);
  await a.screenshot({ path: "test-artifacts/home.png" });
  await a.locator("#nickname").fill("Dhiraj");
  await a.locator("#create").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  const code = await a.locator("#roomCode").textContent();
  await b.goto(`${base}/?room=${code}`);
  await b.locator("#connection").filter({ hasText: "ONLINE" }).waitFor();
  await b.locator("#nickname").fill("Rahul");
  await b.locator("#join").click();
  await b.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#start").click();
  await a.locator("#countdown").filter({ hasText: "3" }).waitFor();
  await b.locator("#countdown").filter({ hasText: "3" }).waitFor();
  await a.waitForTimeout(3300);
  await a.keyboard.down("w");
  await a.waitForTimeout(1800);
  await a.keyboard.up("w");
  assert.ok(Number(await a.locator("#speed").textContent()) > 40);
  await a.screenshot({ path: "test-artifacts/race.png" });
  await b.screenshot({ path: "test-artifacts/remote.png" });
  await a.keyboard.down("d");
  await a.keyboard.down("w");
  await a.waitForTimeout(800);
  await a.keyboard.up("d");
  await a.keyboard.up("w");
  await a.keyboard.press("r");
  // Finish fixture checks result/rematch presentation. Physical three-lap racing is tested separately.
  const room = game.rooms.get(code);
  [...room.race.cars.values()].forEach((c, i) => {
    c.passed = 72;
    c.finished = 75000 + i * 2000;
  });
  await a.locator("#results").waitFor({ state: "visible" });
  await b.locator("#results").waitFor({ state: "visible" });
  assert.equal(
    await a.locator("#winner").textContent(),
    "Dhiraj takes the win.",
  );
  await a.screenshot({ path: "test-artifacts/results.png" });
  await a.locator("#rematch").click();
  await a.locator("#lobby").waitFor({ state: "visible" });
  await b.locator("#lobby").waitFor({ state: "visible" });
  await a.locator("#lobby .leave").click();
  await a.locator("#home").waitFor({ state: "visible" });
  await b.locator("#lobby .leave").click();
  await b.locator("#home").waitFor({ state: "visible" });
  await a.setViewportSize({ width: 390, height: 844 });
  await a.screenshot({ path: "test-artifacts/mobile.png" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: two Chrome pages, 3D, create/join, synchronized countdown, keyboard driving, leave; no page errors.",
  );
} finally {
  await browser.close();
  await game.close();
}

````

## LICENSE

Exact workspace path: `C:/Users/jadav/Coding/car racing game/LICENSE`

````
MIT License

Copyright (c) 2026 APEX Friends Racing contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

````

## README.md

Exact workspace path: `C:/Users/jadav/Coding/car racing game/README.md`

````
# 🏎️ APEX — 3D Friend Racing Game

A complete friends-only racing project: Babylon.js graphics, an authoritative Node.js/Socket.IO server, Cannon physics, private rooms, 2–6 drivers, 3 laps, results, and rematches. No database, player accounts, paid assets, or API keys.

**Status:** implemented and locally tested. Public deployment and a race between different homes are not yet verified. No public game URL has been created. Follow the one-time account steps below; after deployment you do not start a server for each race.

## Technology and architecture

| Part | Choice | Purpose |
|---|---|---|
| 3D | Babylon.js 8 | Procedural cars, stadium track, palm trees, follow camera |
| Physics | cannon-es 0.20 (MIT) | Server-side gravity, ground and barrier collisions |
| Multiplayer | Socket.IO 4 | 30 input packets/second, 20 room snapshots/second |
| Server | Node.js 24, Express 5 | Serves the website and runs each race |
| Build | Vite 7 | Builds browser assets |
| Storage / login | None | Rooms live in memory; players enter nicknames |
| Hosting | One Render Free web service | One HTTPS URL for website and multiplayer |

Cannon is a deliberate simplification: the server runs the same lightweight JavaScript simulation without a browser or WASM setup, and Babylon renders its results. Havok is not required or bundled. Cannon is MIT licensed: https://github.com/pmndrs/cannon-es. Opponent cars are ghosts to prevent blocking; ground and barriers are physical. This is an arcade game, not realistic suspension physics.

The client sends six boolean controls; it cannot submit position, laps, or results. The server advances physics at 60 ticks/second, accepts the next checkpoint only in the forward direction, and counts 24 gates per lap. Reset returns to the last accepted checkpoint without increasing progress. A car finishes at 72 crossings. Results appear when everyone remaining finishes, 60 seconds after the first finish, or at the 10-minute race limit. Unfinished drivers receive DNF. Finishes in the same server tick share a time; roster order breaks exact ties.

The browser smooths position and heading between snapshots. This adds some input latency; select a hosting region near the group. No client prediction or lag compensation is implemented. Names are escaped in HTML and drawn as canvas text in 3D. Basic payload, nickname, room, player-count, request-rate and room-count limits protect the server. Room codes are invitations, not strong authentication.

Disconnects immediately remove the driver and transfer host to the next remaining player. Empty rooms are deleted. Socket.IO reconnects transport automatically, but a disconnected driver must join the lobby again; mid-race joining/resuming is intentionally disabled. A host can rematch after results to reopen the lobby. Restarts and deploys erase all rooms.

## Project structure / important files

```text
car racing game/
├── client/
│   ├── index.html              Page, lobby, HUD, results and touch controls
│   └── src/
│       ├── main.js             Socket client, input, UI, audio and minimap
│       ├── scene.js            Babylon track, cars, environment and camera
│       └── style.css           Responsive racing interface
├── server/
│   ├── index.js                HTTP, rooms, validation and race lifecycle
│   └── race.js                 Physics, checkpoint rules and snapshots
├── shared/
│   └── track.js                Loop geometry, checkpoints and configuration
├── test/
│   └── race.test.js            Physics and actual Socket.IO integration tests
├── scripts/
│   └── browser-check.mjs       Two-window Chrome smoke test and screenshots
├── .github/workflows/ci.yml    Run tests and build on GitHub
├── .gitignore                 Excludes generated files and secrets
├── LICENSE                    MIT license for project source
├── package.json               Dependencies and commands
├── package-lock.json          Exact dependency versions; commit this file
├── vite.config.js             Browser build configuration
├── render.yaml                Free Render service definition
├── README.md                  This guide
├── VERIFICATION.md            Actual checks and remaining limitations
└── COMPLETE_SOURCE.md         Generated source listing with exact file paths
```

`node_modules/`, `dist/`, and `test-artifacts/` are generated and ignored by Git. `dist/` is the deployable website, served by the Node process. The source listing excludes only itself and includes the complete lockfile as well as every source and configuration file.

## Local setup — Windows PowerShell

On this computer Node.js and Git were already installed, and dependencies/build have been prepared. If the server is still running, simply open **http://localhost:3000**.

On a different computer:

1. Open https://nodejs.org/en/download. Select **Node.js 24 LTS**, **Windows**, **x64**, **Windows Installer (.msi)**. Run it with default options, including PATH. This project was tested with Node 24.19.0; use the latest 24 LTS patch for a new installation.
2. Close and reopen PowerShell. Check:

```powershell
node --version
npm.cmd --version
```

3. Copy this project folder, or clone the GitHub repository you create below. Open PowerShell and run:

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
npm.cmd ci
npm.cmd run build
npm.cmd start
```

4. You should see `APEX racing: http://localhost:3000`. Open that URL in Chrome, Edge or Firefox. Keep that terminal open while testing locally. Ctrl+C stops it.

For editing with automatic frontend updates, stop the production server with Ctrl+C and use:

```powershell
npm.cmd run dev
```

Both frontend and backend start with this one command at **http://localhost:3000**. Vite is middleware in Node; there is no second port and no second terminal required. Restart this command after changing server files.

To run automated checks:

```powershell
npm.cmd test
npm.cmd run build
```

Optional browser check: install Google Chrome from https://www.google.com/chrome/ if missing, then open a PowerShell window (the test starts its own isolated server):

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
node scripts/browser-check.mjs
```

Screenshots are written to `test-artifacts/`. Chrome automation uses a temporary isolated browser profile, not your personal browser session.

## Test with two players

1. Open **http://localhost:3000** in a browser window. Enter `Dhiraj`; click **CREATE A RACE**.
2. Click **COPY INVITE LINK**. Open the copied link in a second window or an incognito window on the same computer.
3. Enter `Rahul`; click **JOIN →**. Both windows should show both names and different car colors.
4. In Dhiraj's window click **START RACE →**. Both windows count down together.
5. Click the game area if needed. Hold W to accelerate; use A/D to steer. In the other window watch the first car move. Use R if stuck. If a window loses focus, controls release automatically.
6. Follow the loop and glowing gate posts for three laps. Each finish registers on the server. After both finish (or the timeout), the host clicks **RUN IT BACK ↻**, then starts again.

Controls: W/Up accelerate; S/Down brake then reverse; A/Left and D/Right steer; Space drift; R reset. Touch buttons appear on devices with coarse pointers. Sound is opt-in using **SOUND OFF**; it enables synthesized engine and countdown/results tones. Low quality reduces render resolution. No downloaded music or models.

Testing over your home Wi-Fi requires the PC's LAN address, not localhost. Run `ipconfig`, find the active Wi-Fi adapter's IPv4 address, and open `http://THAT-ADDRESS:3000` on the other device. If Windows asks, allow Node on your trusted private network. The easiest test between different homes is the deployed HTTPS URL below; do not forward router ports.

## Deploy online — one-time setup

### Current free-tier limitations

Verified against official Render documentation on 2026-09-12: https://render.com/docs/free and https://render.com/docs/websocket.

Render currently offers a Free Node web service with managed HTTPS and public WebSockets. It sleeps after 15 minutes without incoming HTTP/WebSocket traffic. Opening the website wakes it; allow about one minute. There are 750 free instance hours per workspace per month shared across free services, plus bandwidth and build limits. Free instances can restart; all rooms are then lost. This is not a permanent-free guarantee or an uptime guarantee. Check the linked pricing/usage pages before selecting the plan. Monitor Billing → Monthly Included Usage. With no payment method, exceeding relevant free limits suspends service/builds instead of buying extra usage. If adding a card, review spending controls first.

### A. Put the project on GitHub

🔴 **YOU MUST DO THIS — sign in/create your account and publish this repository.** No GitHub repository-creation or Render deployment credentials are available in this environment.

Simplest: GitHub Desktop.

1. Open https://github.com/signup and create a free account if needed.
2. Open https://desktop.github.com/download/ and install GitHub Desktop. Choose **Sign in to GitHub.com**, and finish the browser sign-in.
3. In GitHub Desktop choose **File → Add Local Repository**. Local path: `C:\Users\jadav\Coding\car racing game`. Click **Add Repository**. A local Git repository has already been prepared.
4. Click **Publish repository**. Name: `apex-friends-racing`. Keep **Keep this code private** checked. Click **Publish Repository**.
5. Click **View on GitHub**. You should see `client`, `server`, `package.json`, and `render.yaml`. Do not upload `node_modules` or `dist`.

Windows note for this prepared workspace: the Git folder was created by the sandbox account. If GitHub Desktop offers a repository trust prompt, review this exact project path and accept it. If command-line Git reports **dubious ownership**, add the following command-only option after `git` in each command; it trusts only this project for that invocation and changes no file ownership:

```powershell
git -c safe.directory='C:/Users/jadav/Coding/car racing game' status
git -c safe.directory='C:/Users/jadav/Coding/car racing game' branch -M main
git -c safe.directory='C:/Users/jadav/Coding/car racing game' remote add origin https://github.com/YOUR-USERNAME/apex-friends-racing.git
git -c safe.directory='C:/Users/jadav/Coding/car racing game' push -u origin main
```

Use your actual GitHub username. This option was used successfully to create the local commit. No Windows ownership or persistent Git trust settings were changed.

Alternative command-line workflow (do not do both):

1. Open https://github.com/new while signed in.
2. Repository name: `apex-friends-racing`; choose **Private**. Leave README, .gitignore and license initialization unchecked. Click **Create repository**.
3. Copy the repository HTTPS URL from that page. In PowerShell:

```powershell
Set-Location 'C:\Users\jadav\Coding\car racing game'
git status
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/apex-friends-racing.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username. Complete the Git Credential Manager browser sign-in if requested; do not paste passwords or access tokens into chat.

For a fresh source copy that has no `.git` folder, run these first (the prepared workspace does not need another initial commit):

```powershell
git init
git add .
git commit -m "Build APEX multiplayer racing game"
git branch -M main
```

`init` creates history, `add` stages files, `commit` saves a version, `branch` names it main, `remote` connects GitHub, and `push` uploads. If Git asks for identity, set `git config user.name "Your name"` and `git config user.email "Your GitHub email"`, then retry the commit. Git is available here; on another PC install it from https://git-scm.com/downloads/win.

### B. Create the free Render service

🔴 **YOU MUST DO THIS — connect the repository to your Render account.**

1. Open https://dashboard.render.com/ and sign up/sign in. Choose GitHub sign-in if convenient.
2. Click **New + → Web Service**. Choose **Git Provider**, connect GitHub, and authorize access to `apex-friends-racing`. Select that repository.
3. Enter these exact settings:

| Setting | Value |
|---|---|
| Name | `apex-friends-racing` (add a suffix if taken) |
| Language / Runtime | `Node` |
| Branch | `main` |
| Region | Closest available to your friends (Singapore for India if offered) |
| Root Directory | Leave blank |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Instance Type | **Free — $0/month** |
| Health Check Path | `/health` |
| Environment variable | `NODE_ENV` = `production` |
| Environment variable | `NODE_VERSION` = `24.19.0` |

4. Click **Deploy Web Service**. Do not select a paid instance, database, disk, or custom domain. Wait for the build log to finish and the status to become **Live**.
5. Click the `https://...onrender.com` address at the top. This is **both the frontend URL and backend URL**. Open `https://...onrender.com/health`; it should show `{"ok":true}`.
6. Repeat the two-player test using this address. Ask one friend on a different internet connection to join. This final internet-access test has not been performed by the agent.

Alternative: **New + → Blueprint**, select the repository and apply `render.yaml`. Inspect the service plan is Free before applying. It contains the same values as the manual form.

### HTTPS, WSS and CORS

The website and Socket.IO share one origin. `io()` automatically connects to the current site's host. Render terminates TLS, and Socket.IO uses HTTPS polling then WSS where available. No separate frontend URL, backend URL variable, wildcard CORS setting, certificate, or custom port is needed. Render supplies `PORT`; the app binds to `0.0.0.0`. Do not change the client to localhost or hardcode an `http://` backend on the deployed website.

Official deployment instructions: https://render.com/docs/deploy-node-express-app. Render automatically redeploys pushes to the linked branch. To update later:

```powershell
git add .
git commit -m "Update game"
git push
```

Deploy between races: every restart clears in-memory rooms. Once online you can close your computer and local terminals; Render runs the game for the group.

## Final game URL

No public URL exists yet. Render will assign one like `https://apex-friends-racing-xxxx.onrender.com` after your service is Live. That example is a pattern, not a deployed address. Copy the actual address from your service dashboard.

## Send this to friends

1. Open the invite link I send you in Chrome, Edge or Firefox.
2. Enter your nickname and click **JOIN →** (the room code is already filled in).
3. Wait for me to start the race, then the 3–2–1 countdown.
4. W/A/S/D or arrow keys to drive; Space to drift; R if stuck. Complete three laps.
5. Stay for the results and rematch!

## Troubleshooting

| Problem | Likely reason | Exact fix |
|---|---|---|
| `node` / `npm` not recognized | Node missing or old terminal PATH | Install Node 24 LTS from the link above, close every PowerShell window, reopen, run `node --version`. |
| `npm.ps1 cannot be loaded` | PowerShell script policy | Use `npm.cmd` in every command as shown. No policy change needed. |
| Port 3000 already in use | Another server is running | Use the existing game at localhost:3000, or stop its terminal with Ctrl+C. For a different port run `$env:PORT='3001'` then `npm.cmd start`; open localhost:3001. |
| CORS error | Frontend and backend were split or hardcoded URL added | Restore `const ... socket=io()` in main.js and deploy the entire root as one Web Service. No `VITE_SERVER_URL` is needed. Rebuild/redeploy. |
| Socket.IO connection failed | Server stopped, waking, or wrong URL | Open the same host's `/health`. Start Node locally, or check Render service is Live and wait 60–90 seconds. Reload. |
| WebSocket failed | Proxy blocks WebSockets | Socket.IO normally falls back to HTTP polling. If it remains offline, try a browser without network-blocking extensions or a different network. |
| Friends cannot join | Wrong/expired code, full room, active race, localhost invite | Share the deployed HTTPS link. Create a fresh lobby; maximum six people; mid-race joins are disabled. |
| Works locally but not online | Wrong root/build/start/port | Use the exact Render table above, root blank, `npm ci --include=dev && npm run build`, `npm start`; app must keep supplied PORT behavior. |
| HTTPS/WSS or mixed-content error | Hardcoded HTTP server | Restore same-origin `io()`. Use Render's HTTPS URL. Rebuild/redeploy. |
| Blank 3D screen | WebGL disabled or outdated driver/browser | In Chrome Settings → System enable graphics acceleration, relaunch Chrome, update graphics driver; try Edge. Verify `/health` and reload Ctrl+F5. |
| Low frame rate | High pixel density, weak GPU or software rendering | Click **QUALITY HIGH** to switch to Low; close extra 3D browser windows; enable hardware acceleration. |
| Car falls through road | Modified ground/physics code | Original track has a ground plane. Press R. Restore `server/race.js` ground setup and flat track; server auto-resets out-of-bounds cars. |
| Car stuck at barrier | Steering into wall | Brake/reverse with S or press R (2-second reset cooldown). |
| Remote cars not moving | Race not started, connection lost, input window unfocused | Wait for GO; focus the driving window; verify ONLINE indicator and `/health`. Disconnected players must rejoin the next lobby. |
| Car stops accelerating when switching windows | Controls clear on blur, intentionally | Keep the driving window focused. Use another device to drive both simultaneously. |
| Lap does not count | Gate skipped or driving backward | Follow the glowing next gate. Press R to return to last valid checkpoint. Every gate must be crossed forward. |
| Deployment build failed | Wrong folder/Node/dependencies | Confirm root blank, Node 24, lockfile committed and exact build command; inspect Render Events → failed deploy → logs. Run `npm.cmd ci` and `npm.cmd run build` locally. |
| Server crashes / all rooms disappear | Restart, deploy, resource limit or edited code | Check Render Logs, run `npm.cmd test`, redeploy known working commit. Create new rooms; no persistence is expected. |
| Free hosting sleeps | No traffic for 15 minutes | Open the game and wait about a minute. Create a new room if the old one was lost. No manual server command required. |
| Service suspended | Free monthly allowance exceeded | Check Render Billing → Monthly Included Usage. Wait for reset or reduce other free services; do not upgrade if you want to remain free. |
| No sound | Browser audio requires a gesture | Click **SOUND OFF** to turn audio on; check OS volume. |
| Invite copy fails | Clipboard blocked / insecure LAN HTTP | Copy the address bar; room code is also displayed. Clipboard should work on localhost and deployed HTTPS. |
| `remote origin already exists` | Repository already connected | Run `git remote -v`. If it is your correct repository, skip `remote add` and run `git push -u origin main`. |

## Verification

See `VERIFICATION.md` for observed checks, not just a mental checklist. Public deployment remains pending your account connection. Mobile layout is checked at a narrow viewport; actual touch-device play, wide-area latency and low-end hardware performance still need real-device testing.

# 🔴 ONLY THINGS YOU MUST DO

1. Sign in to GitHub and publish the prepared repository (GitHub Desktop steps above).
2. Sign in to Render, connect that repository, and select the **Free** web service using the exact settings above.
3. Copy your assigned HTTPS URL and invite a friend on another network for the final online race check.

No local server management is needed after that one-time deployment, subject to free hosting limits.

````

## VERIFICATION.md

Exact workspace path: `C:/Users/jadav/Coding/car racing game/VERIFICATION.md`

````
# Verification record

Checked on 2026-09-12, Windows, Node.js 24.19.0.

## Observed passing checks

- Dependency installation completed; npm reported zero known vulnerabilities at install time.
- Production Vite build completed. Main browser bundle is about 1.13 MB (280 KB gzip), plus shader chunks. Vite's large-chunk advisory remains; it is not a build error.
- Development server started; `/health` returned `{"ok":true}` and the Vite-transformed main module returned HTTP 200.
- Production server started and served the browser app.
- Track continuity and nearest-track projection tested across the complete loop.
- Server simulation tested for acceleration, braking/reverse, ground contact and barrier containment.
- Stale inputs and lobby inputs do not accelerate cars.
- Checkpoint tests reject skipped/backward gates and accept 72 ordered crossings.
- An automated driver physically completed three laps using steering/throttle through the actual Cannon simulation, without teleporting between checkpoints.
- Real Socket.IO clients tested create/join errors, room isolation, host-only start/rematch, countdown phase, network movement observed by a second client, finish/results, rematch reset and empty-room cleanup.
- Seven connecting clients tested six-player room capacity, unique colors, ignored spoofed progress, actual host disconnect transfer and finish-window timeout.
- Two headless Chrome pages loaded Babylon's rendered scene, created/joined a room, showed synchronized countdown, accelerated with keyboard controls, turned, reset, and left their room without page JavaScript errors.
- Browser results and rematch presentation checked using a server-side finish fixture. This is a UI test, not a human-driven full-race browser test.
- Screenshots inspected at 1440×1000 and 390×844: home, race, remote view, results and narrow home layout.

## Reproduce

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
```

The browser script requires installed Google Chrome. It runs a temporary local production server, then closes it. Screenshots go to the ignored `test-artifacts/` directory.

## Not yet verified / intentional limits

- No Render deployment was performed: no Render deployment credentials or connected account were available. No public URL exists yet.
- HTTPS/WSS configuration is prepared, but public connectivity and play between separate homes require the deployed service.
- Chrome used software WebGL in headless tests. These establish rendering and behavior, not a desktop GPU frame-rate guarantee.
- Narrow-screen layout was checked; physical mobile touch play and audio quality were not manually tested.
- No packet-loss/large-latency testing; controls are server authoritative without local prediction.
- Players disconnected during a race cannot resume it. Rejoin a lobby after the host rematches; host automatically transfers.
- Cars are ghosts relative to one another. Ground and barriers collide. There is no suspension or car-to-car impact simulation.
- No persistence, saved rankings, accounts or paid assets. Render restarts clear rooms.
- Engine and countdown/results tones are synthesized. Dedicated collision/finish-per-driver sounds are not included.
- Free-tier availability and allowance can change; official hosting references are in README.md.

The local implementation is working under the tests above. The complete online goal remains pending one-time account setup and a public race check.

````
