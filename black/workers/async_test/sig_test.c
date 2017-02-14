#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

static void sigcont_handler(int signo) {
    puts("Received SIGCONT");
}

static void sigstp_handler(int signo) {
    puts("Received SIGSTP");
}

int main(void) {
    if (signal(19, sigcont_handler) == SIG_ERR) {
        fputs("An error occurred while setting a signal handler.\n", stderr);
        return EXIT_FAILURE;
    }

    if (signal(18, sigstp_handler) == SIG_ERR) {
        fputs("An error occurred while setting a signal handler.\n", stderr);
        return EXIT_FAILURE;
    }

    int i = 0;
    while (1) {
    	if (i == 25) {
    		return 0;
    	}
    	else {
    		printf("%d\n", i);
    		i++;
	    	puts("I am not sleeping");
	    	sleep(1);
    	}
    }
    return EXIT_SUCCESS;
}