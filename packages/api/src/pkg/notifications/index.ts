import { integrationService } from "../integrations/service";
import { subscriberNotificationService } from "../subscribers/service";

export function initializeNotifications() {
	return {
		integrationService,
		subscriberNotificationService,
	};
}

initializeNotifications();
