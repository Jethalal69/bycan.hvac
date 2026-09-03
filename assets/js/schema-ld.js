/**
 * ByCan HVAC Engineering — Local SEO & Schema.org Structured Data
 * Injects HVACBusiness, LocalBusiness, and Service Catalog JSON-LD
 */

(() => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "ByCan HVAC Engineering",
    "image": "https://bycan.ca/assets/images/gallery/hero-boiler.jpg",
    "@id": "https://bycan.ca",
    "url": "https://bycan.ca",
    "telephone": "+1-437-599-9215",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1460 The Queensway, Unit 103",
      "addressLocality": "Etobicoke",
      "addressRegion": "ON",
      "postalCode": "M8Z 1S7",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6212,
      "longitude": -79.5298
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "07:00",
        "closes": "22:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Etobicoke" },
      { "@type": "City", "name": "Toronto" },
      { "@type": "City", "name": "Mississauga" },
      { "@type": "City", "name": "Brampton" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "HVAC & Hydronic Heating Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Boiler & Hydronic Heating Installation & Repair",
            "description": "Specialized high-efficiency NTI boiler installations, radiant heating loops, and manifold piping in Toronto and GTA."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gas Furnace Emergency Repair & Replacement",
            "description": "Same-day diagnostic and repair for gas furnaces across Etobicoke and the Greater Toronto Area."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Air Conditioning & Heat Pump Service",
            "description": "Central AC repair, cold-climate heat pump installation, and precision copper line brazing."
          }
        }
      ]
    },
    "sameAs": [
      "https://www.instagram.com/hvac.bycan/",
      "https://www.facebook.com/hvac.bycan/"
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schemaData);
  document.head.appendChild(script);
})();
