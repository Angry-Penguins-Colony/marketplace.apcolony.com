[![Node.js CI](https://github.com/Angry-Penguins-Colony/server-penguins-renderer/actions/workflows/node.js.yml/badge.svg)](https://github.com/Angry-Penguins-Colony/server-penguins-renderer/actions/workflows/node.js.yml)

# Performance impact of compression

|                 | without compression | with compression |
|-----------------|---------------------|------------------|
| Generation time | 329.3767            | 422.0535ms       |
| File size       | 4798Ko              | 99Ko             |

Performance impact = 93ms (+20%)
File size saved = 4699Ko (-98%)
