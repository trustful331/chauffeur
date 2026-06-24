import logo from './logo.png'

import homeHero from './home/hero.png'
import homeWheels from './home/wheels.png'
import homeSClass from './home/s_class.png'
import homeSClass2 from './home/s_class_2.png'
import homeSClass3 from './home/s_class3.png'

import servicesHero from './services/heo.png'
import service1 from './services/service1.png'
import service2 from './services/service2.png'
import service3 from './services/service3.png'
import service4 from './services/service4.png'
import service5 from './services/service5.png'
import servicesSync from './services/sync.png'

import corporateHero from './corporate/hero.png'
import corporateGrid from './corporate/grid.png'
import corporateGrid2 from './corporate/grid2.png'

import contactHero from './contact/hero.png'
import contactVector from './contact/verctor.png'

import aboutHero from './about/hero.png'
import aboutGrid from './about/grid.png'

import fleetHero from './fleet/hero.png'
import fleetSlide from './fleet/fleet_slid.png'
import fleetGrid1 from './fleet/grid1.png'
import fleetGrid2 from './fleet/grid2.png'
import fleetGrid3 from './fleet/grid3.png'

export const images = {
  logo,
  home: {
    hero: homeHero,
    wheels: homeWheels,
    fleet: [homeSClass, homeSClass2, homeSClass3] as const,
  },
  services: {
    hero: servicesHero,
    coverage: [service1, service2, service3, service4, service5] as const,
    sync: servicesSync,
  }, 
  corporate: {
    hero: corporateHero,
    partners: corporateGrid,
    sustainability: corporateGrid2,
  },
  contact: {
    hero: contactHero,
    illustration: contactVector,
  },
  about: {
    hero: aboutHero,
    hospitality: aboutGrid,
  },
  fleet: {
    hero: fleetHero,
    slide: fleetSlide,
    grid: [fleetGrid1, fleetGrid2, fleetGrid3] as const,
  },
} as const
