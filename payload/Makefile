
PS4_PAYLOAD_SDK ?= $(HOME)/ps4-payload-sdk

BUILD := build
ELF := $(BUILD)/package_hub.elf
SRC := src/main.c

include $(PS4_PAYLOAD_SDK)/toolchain/orbis.mk

CFLAGS += -Wall -Wextra -O2 -g

all: $(ELF)

$(ELF): $(SRC)
	mkdir -p $(BUILD)
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $< $(LDLIBS)

clean:
	rm -rf $(BUILD)

.PHONY: all clean
