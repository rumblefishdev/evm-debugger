define PRINT_HELP_PYSCRIPT
import re, sys

print("{ln}{sp}HELP{sp}{ln}".format(ln=24*"=", sp=5*" "))
for line in sys.stdin:
	category_match = re.match(r'^#%% (.*)$$', line)
	target_match = re.match(r'^([a-zA-Z0-9_-]+):.*?#% (.*)$$', line)
	if category_match:
		category, = category_match.groups()
		print("\n{}:".format(category))
	if target_match:
		target, help = target_match.groups()
		print("  {:26} {}".format(target, help))
endef
export PRINT_HELP_PYSCRIPT

.PHONY: help
.DEFAULT_GOAL := help
help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

#%% Utils commands
.PHONY: bootstrap
bootstrap: #% Project bootstrap
	npm install --include=dev
	lerna bootstrap
	$(MAKE) build_deps

.PHONY: clean
clean: #% Clean project
	@if [ -d "node_modules" ]; then \
		npm run clean; \
	fi

.PHONY: rebootstrap
rebootstrap: clean bootstrap #% Clean project and bootstrap

.PHONY: build_deps
build_deps: #% Build project dependencies
	cd packages/types && npm run build
	cd packages/analyzer && npm run build
