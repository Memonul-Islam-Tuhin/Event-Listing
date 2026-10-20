import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800';

@Injectable()
export class EventsService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Tech Conference 2026',
      description: 'A full day of talks about web, AI and cloud.',
      location: 'Dhaka',
      date: '2026-11-20',
      category: 'Tech',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      price: 1500,
    },
    {
      id: 2,
      title: 'Live Music Night',
      description: 'Enjoy live bands and food stalls.',
      location: 'Gazipur',
      date: '2026-12-05',
      category: 'Music',
      image:
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
      price: 500,
    },
    {
      id: 3,
      title: 'City Marathon 2026',
      description:
        'Run the 5K, 10K or half marathon with hundreds of runners. Medals and refreshments for every finisher.',
      location: 'Dhaka',
      date: '2026-12-15',
      category: 'Sports',
      image:
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      price: 300,
    },
    {
      id: 4,
      title: 'Startup & Business Summit',
      description:
        'Meet founders and investors, join workshops on funding and marketing, and grow your network.',
      location: 'Chattogram',
      date: '2026-12-20',
      category: 'Business',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      price: 2000,
    },
    {
      id: 5,
      title: 'Modern Art Exhibition',
      description:
        'A showcase of paintings, sculptures and digital art from local artists. Free entry for students.',
      location: 'Gazipur',
      date: '2027-01-10',
      category: 'Art',
      image:
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
      price: 0,
    },
  ];
  private nextId = 6;

  findAll(category?: string) {
    return category
      ? this.events.filter(
          (e) => e.category.toLowerCase() === category.toLowerCase(),
        )
      : this.events;
  }

  findOne(id: number) {
    const event = this.events.find((e) => e.id === id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  create(dto: CreateEventDto) {
    const event: Event = {
      ...dto,
      id: this.nextId++,
      image: dto.image || DEFAULT_IMAGE,
    };
    this.events.unshift(event);
    return event;
  }

  update(id: number, dto: UpdateEventDto) {
    const event = this.findOne(id);
    Object.assign(event, dto);
    return event;
  }

  remove(id: number) {
    this.findOne(id);
    this.events = this.events.filter((e) => e.id !== id);
    return { deleted: true };
  }
}
