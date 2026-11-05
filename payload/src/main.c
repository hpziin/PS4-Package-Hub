
#include <stdio.h>
#include <string.h>

extern int sceKernelSendNotificationRequest(
    int device,
    void *request,
    size_t size,
    int flags
);

typedef struct {
    char reserved[45];
    char message[3075];
} notification_request_t;

static void notify(const char *message) {
    notification_request_t request;
    memset(&request, 0, sizeof(request));

    snprintf(
        request.message,
        sizeof(request.message),
        "%s",
        message
    );

    sceKernelSendNotificationRequest(
        0,
        &request,
        sizeof(request),
        0
    );
}

int main(void) {
    printf("[PS4 PACKAGE HUB] Payload iniciado.\n");

    notify("PS4 Package Hub: payload carregado!");

    printf("[PS4 PACKAGE HUB] Diagnostico concluido.\n");

    return 0;
}
