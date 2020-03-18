# if this session isn't interactive, then we don't want to allocate a
# TTY, which would fail, but if it is interactive, we do want to attach
# so that the user can send e.g. ^C through.
INTERACTIVE := $(shell [ -t 0 ] && echo 1 || echo 0)
ifeq ($(INTERACTIVE), 1)
	DOCKER_FLAGS += -t
endif

DOCKER_IMAGE=oxide/webiste

.PHONY: build
build: ## Build the docker image.
	@docker build --rm --force-rm -t $(DOCKER_IMAGE) .

.PHONY: run
run: build ## Runs the build.
	docker run --rm -i $(DOCKER_FLAGS) \
		--name oxide-website \
		-v $(CURDIR):/usr/src/website:ro \
		--disable-content-trust \
		$(DOCKER_IMAGE)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
