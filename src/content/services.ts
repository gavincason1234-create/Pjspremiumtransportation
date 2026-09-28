import type { ServiceType } from "@/lib/types";

export interface ServiceContent {
  slug: string;
  serviceType: ServiceType;
  icon: "plane" | "party" | "stethoscope" | "briefcase" | "clock" | "mapPin";
  title: string;
  oneLiner: string;
  bullets: string[];
}

/** Marketing content for the services PJ's actually offers (from the Facebook page artwork). */
export const SERVICES: ServiceContent[] = [
  {
    slug: "airport",
    serviceType: "airport",
    icon: "plane",
    title: "Airport transportation",
    oneLiner: "DFW and Dallas Love Field at any hour, with a driver who is already awake.",
    bullets: [
      "Early-morning and late-night departures are part of the service, not an exception.",
      "Share your flight number and your pickup is planned around it, coming and going.",
      "Airport concierge: a curbside meeting, help with your bags and a calm start to the trip.",
    ],
  },
  {
    slug: "winstar",
    serviceType: "winstar",
    icon: "party",
    title: "WinStar & nights out",
    oneLiner: "WinStar, concerts, dinners and celebrations, with a reliable ride home already arranged.",
    bullets: [
      "WinStar World Casino and Resort is a short drive. Go and come back on your schedule, not the shuttle's.",
      "Concerts, games and dinners in Dallas–Fort Worth without the parking, the traffic or the drive back.",
      "A blanket and pillow wait in the back for the ride home.",
    ],
  },
  {
    slug: "medical",
    serviceType: "medical",
    icon: "stethoscope",
    title: "Medical appointments",
    oneLiner: "A steady ride to and from appointments in Gainesville, Denton or the Metroplex.",
    bullets: [
      "Door-to-door, with a hand for bags, walkers or a slow start.",
      "Your driver waits or returns for you, whichever you prefer.",
      "Family can follow the ride on a private tracking link when your driver shares it.",
    ],
  },
  {
    slug: "metroplex",
    serviceType: "metroplex",
    icon: "briefcase",
    title: "Metroplex, corporate & daily",
    oneLiner: "Dallas–Fort Worth meetings, commutes and events, handled with the same care every time.",
    bullets: [
      "Business travel to Dallas, Fort Worth and the surrounding Metroplex, on time and quiet enough to work from the back seat.",
      "Standing reservations are welcome. Book a recurring ride once and stop re-booking.",
      "One named driver for the whole trip, there and back.",
    ],
  },
  {
    slug: "hourly",
    serviceType: "hourly",
    icon: "clock",
    title: "Hourly / as directed",
    oneLiner: "Keep the car and driver for as long as you need. Several stops, one reservation.",
    bullets: [
      "Errands, shopping, visiting family or a full day in the city.",
      "No re-booking between stops. Your driver waits, and the plan can change along the way.",
      "Well suited to out-of-town guests, special occasions and days with a long list.",
    ],
  },
  {
    slug: "local",
    serviceType: "local",
    icon: "mapPin",
    title: "Local trips",
    oneLiner: "Myra, Cooke County, Gainesville and everywhere close to home.",
    bullets: [
      "Short hops around town with the same reserved, named-driver service as a trip to DFW.",
      "A ride to the train, a dinner in Gainesville, a friend's place across the county.",
      "Reserve ahead and the car is outside before you are ready.",
    ],
  },
];
