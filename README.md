# Grafana K6 Performance Testing

## GitHub Actions + SonarCloud

[![K6 Performance Testing](https://github.com/ugioni/k6-performance-testing/actions/workflows/node.js.yml/badge.svg)](https://github.com/ugioni/k6-performance-testing/actions/workflows/node.js.yml)

</br>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ugioni_playwright-e2e&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ugioni_playwright-e2e)

## Getting Started

In order to execute this project you must follow the steps below:

1. Install [Node JS](https://nodejs.org/) (version >= 22.x)
1. Install [Grafana K6](https://dl.k6.io/msi/k6-latest-amd64.msi)
1. Run `npm i --save-dev` to install all the project dependencies
1. Run `npm run ci` to execute the entire test suite

All execution reports can be found in `src/output`.