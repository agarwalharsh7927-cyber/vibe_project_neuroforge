/**
 * Component Library Definitions
 * Each component has a type, default props, and default styles.
 */

const ComponentRegistry = {
    Container: {
        type: 'Container',
        icon: 'bx-layout',
        label: 'Container',
        isContainer: true,
        props: { className: 'container' },
        styles: {
            display: 'block', padding: '20px', minHeight: '100px', backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', margin: '0', color: '#fff'
        }
    },
    Navbar: {
        type: 'Navbar',
        icon: 'bx-menu',
        label: 'Navigation Bar',
        isContainer: true,
        props: { className: 'navbar' },
        styles: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '15px 30px', backgroundColor: '#161b22', color: '#ffffff',
            borderBottom: '1px solid #30363d', width: '100%'
        }
    },
    Card: {
        type: 'Card',
        icon: 'bx-card',
        label: 'Card (Glass)',
        isContainer: true,
        props: { className: 'card glass-effect' },
        styles: {
            display: 'block', padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '300px', height: 'auto'
        }
    },
    CardSolid: {
        type: 'Card',
        icon: 'bx-square',
        label: 'Card (Solid)',
        isContainer: true,
        props: { className: 'card' },
        styles: {
            display: 'block', padding: '24px', backgroundColor: '#161b22',
            borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            width: '300px', height: 'auto', color: '#fff'
        }
    },
    Heading: {
        type: 'Heading',
        icon: 'bx-heading',
        label: 'Heading',
        isContainer: false,
        props: { text: 'Heading Text', level: 'h2' },
        styles: { fontSize: '32px', fontWeight: '700', color: '#fff', margin: '0' }
    },
    HeadingGlass: {
        type: 'Heading',
        icon: 'bx-font-size',
        label: 'Heading (Glass)',
        isContainer: false,
        props: { text: 'Future Design', level: 'h1' },
        styles: {
            fontSize: '48px', fontWeight: '800', color: '#fff', margin: '0',
            textShadow: '0 0 20px rgba(56, 189, 248, 0.5)', letterSpacing: '-0.02em'
        }
    },
    Paragraph: {
        type: 'Paragraph',
        icon: 'bx-text',
        label: 'Text',
        isContainer: false,
        props: { text: 'Write something amazing here...' },
        styles: { fontSize: '16px', lineHeight: '1.5', color: '#a1b8d1', width: '300px' }
    },
    Button: {
        type: 'Button',
        icon: 'bx-mouse',
        label: 'Button (Primary)',
        isContainer: false,
        props: { text: 'Click Me', href: '#' },
        styles: {
            display: 'inline-block', padding: '12px 24px', backgroundColor: '#0969da',
            color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600'
        }
    },
    ButtonOutline: {
        type: 'Button',
        icon: 'bx-circle',
        label: 'Button (Outline)',
        isContainer: false,
        props: { text: 'Outline', href: '#' },
        styles: {
            display: 'inline-block', padding: '12px 24px', backgroundColor: 'transparent',
            color: '#0969da', borderRadius: '8px', border: '2px solid #0969da', textDecoration: 'none'
        }
    },
    SearchBar: {
        type: 'SearchBar',
        icon: 'bx-search',
        label: 'Search (Minimal)',
        isContainer: false,
        props: { placeholder: 'Search...' },
        styles: {
            width: '300px', padding: '10px 15px', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', backgroundColor: '#161b22', color: '#fff'
        }
    },
    SearchBarGlass: {
        type: 'SearchBar',
        icon: 'bx-search-alt',
        label: 'Search (Glass)',
        isContainer: false,
        props: { placeholder: 'Search the future...' },
        styles: {
            width: '350px', padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff',
            backdropFilter: 'blur(5px)'
        }
    },
    Image: {
        type: 'Image',
        icon: 'bx-image',
        label: 'Image',
        isContainer: false,
        props: {
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            alt: 'Image'
        },
        styles: { width: '300px', height: '200px', borderRadius: '12px', objectFit: 'cover' }
    },
    Video: {
        type: 'Video',
        icon: 'bx-video',
        label: 'Video Player',
        isContainer: false,
        props: {
            src: 'https://www.w3schools.com/html/mov_bbb.mp4',
            controls: true
        },
        styles: { width: '400px', borderRadius: '12px' }
    },
    HeroSection: {
        type: 'Container',
        icon: 'bx-star',
        label: 'Hero Section (Preset)',
        isContainer: true,
        props: { className: 'hero-preset glass-effect' },
        styles: {
            width: '1000px', padding: '80px 40px', textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '30px'
        },
        children: [
            { type: 'Heading', props: { text: 'Create Something Iconic', level: 'h1' }, styles: { fontSize: '64px', color: '#fff', marginBottom: '20px' } },
            { type: 'Paragraph', props: { text: 'The only limit is your imagination. Start building your legacy today.' }, styles: { fontSize: '20px', color: '#a1b8d1', margin: '0 auto 40px auto', width: '600px' } },
            { type: 'Button', props: { text: 'Get Started Free' }, styles: { padding: '16px 32px', fontSize: '18px', backgroundColor: '#38bdf8' } }
        ]
    },
    FeatureBlock: {
        type: 'Card',
        icon: 'bx-grid-alt',
        label: 'Feature Block (Preset)',
        isContainer: true,
        props: { className: 'feature-preset glass-effect' },
        styles: { width: '320px', padding: '40px', textAlign: 'center' },
        children: [
            { type: 'Container', styles: { width: '60px', height: '60px', backgroundColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: [
                { type: 'Heading', props: { text: '⚡', level: 'h3' }, styles: { margin: '0', color: '#fff' } }
            ]},
            { type: 'Heading', props: { text: 'Fast Performance', level: 'h3' }, styles: { color: '#fff', marginBottom: '10px' } },
            { type: 'Paragraph', props: { text: 'Optimized for speed and SEO out of the box.' }, styles: { color: '#a1b8d1', fontSize: '14px' } }
        ]
    },
    PricingTable: {
        type: 'Container',
        icon: 'bx-dollar-circle',
        label: 'Pricing Table (Preset)',
        isContainer: true,
        props: { className: 'pricing-table glass-effect' },
        styles: {
            display: 'flex', gap: '20px', padding: '40px', justifyContent: 'center',
            width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px'
        },
        children: [
            { type: 'Card', props: { className: 'card glass-effect' }, styles: { width: '250px', padding: '30px', textAlign: 'center' }, children: [
                { type: 'Heading', props: { text: 'Basic', level: 'h3' }, styles: { fontSize: '24px', color: '#fff' } },
                { type: 'Heading', props: { text: '$9/mo', level: 'h2' }, styles: { fontSize: '36px', color: '#38bdf8' } },
                { type: 'Paragraph', props: { text: 'Perfect for starters' }, styles: { color: '#a1b8d1' } },
                { type: 'Button', props: { text: 'Choose Plan' }, styles: { width: '100%', marginTop: '20px' } }
            ]},
            { type: 'Card', props: { className: 'card glass-effect' }, styles: { width: '250px', padding: '30px', textAlign: 'center', border: '2px solid #38bdf8' }, children: [
                { type: 'Heading', props: { text: 'Pro', level: 'h3' }, styles: { fontSize: '24px', color: '#fff' } },
                { type: 'Heading', props: { text: '$29/mo', level: 'h2' }, styles: { fontSize: '36px', color: '#38bdf8' } },
                { type: 'Paragraph', props: { text: 'Most popular choice' }, styles: { color: '#a1b8d1' } },
                { type: 'Button', props: { text: 'Get Started' }, styles: { width: '100%', marginTop: '20px', backgroundColor: '#38bdf8' } }
            ]}
        ]
    },
    Testimonial: {
        type: 'Card',
        icon: 'bx-quote-left',
        label: 'Testimonial (Preset)',
        isContainer: true,
        props: { className: 'testimonial-preset glass-effect' },
        styles: { width: '400px', padding: '30px', position: 'relative' },
        children: [
            { type: 'Paragraph', props: { text: '"This platform changed the way I build websites. It is incredibly fast and the results are stunning."' }, styles: { fontSize: '18px', fontStyle: 'italic', color: '#fff', marginBottom: '20px' } },
            { type: 'Container', styles: { display: 'flex', alignItems: 'center', gap: '15px' }, children: [
                { type: 'Image', props: { src: 'https://i.pravatar.cc/150?u=neuroforg' }, styles: { width: '50px', height: '50px', borderRadius: '50%' } },
                { type: 'Container', children: [
                    { type: 'Heading', props: { text: 'Alex Rivers', level: 'h4' }, styles: { margin: '0', color: '#38bdf8', fontSize: '16px' } },
                    { type: 'Paragraph', props: { text: 'Creative Director' }, styles: { margin: '0', fontSize: '12px', color: '#a1b8d1' } }
                ]}
            ]}
        ]
    },
    StatCard: {
        type: 'Card',
        icon: 'bx-trending-up',
        label: 'Stat Counter (Preset)',
        isContainer: true,
        props: { className: 'stat-preset glass-effect' },
        styles: { width: '200px', padding: '20px', textAlign: 'center' },
        children: [
            { type: 'Heading', props: { text: '10k+', level: 'h2' }, styles: { color: '#38bdf8', fontSize: '32px', margin: '0' } },
            { type: 'Paragraph', props: { text: 'Active Users' }, styles: { color: '#a1b8d1', fontSize: '14px', margin: '5px 0 0 0' } }
        ]
    },
    SocialBar: {
        type: 'Container',
        icon: 'bx-share-alt',
        label: 'Social Bar (Preset)',
        isContainer: true,
        props: { className: 'social-bar' },
        styles: { display: 'flex', gap: '15px', padding: '10px' },
        children: [
            { type: 'Button', props: { text: '𝕏' }, styles: { padding: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000' } },
            { type: 'Button', props: { text: 'In' }, styles: { padding: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0077b5' } },
            { type: 'Button', props: { text: 'Fb' }, styles: { padding: '10px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1877f2' } }
        ]
    },
    FAQItem: {
        type: 'Container',
        icon: 'bx-help-circle',
        label: 'FAQ Item (Preset)',
        isContainer: true,
        props: { className: 'faq-preset' },
        styles: { width: '500px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' },
        children: [
            { type: 'Heading', props: { text: 'How does the pricing work?', level: 'h4' }, styles: { color: '#fff', cursor: 'pointer' } },
            { type: 'Paragraph', props: { text: 'Our pricing is transparent and scales with your needs. You can start for free and upgrade as you grow.' }, styles: { color: '#a1b8d1', fontSize: '14px' } }
        ]
    },
    Footer: {
        type: 'Container',
        icon: 'bx-dock-bottom',
        label: 'Footer (Preset)',
        isContainer: true,
        props: { className: 'footer-preset glass-effect' },
        styles: { width: '100%', padding: '60px 40px', display: 'flex', justifyContent: 'space-between', marginTop: '100px' },
        children: [
            { type: 'Container', children: [
                { type: 'Heading', props: { text: 'NeuroForg', level: 'h3' }, styles: { color: '#fff' } },
                { type: 'Paragraph', props: { text: 'Building the future of web design.' }, styles: { color: '#a1b8d1', fontSize: '14px' } }
            ]},
            { type: 'Container', styles: { display: 'flex', gap: '40px' }, children: [
                { type: 'Container', children: [
                    { type: 'Heading', props: { text: 'Product', level: 'h4' }, styles: { color: '#38bdf8', fontSize: '14px' } },
                    { type: 'Paragraph', props: { text: 'Features' }, styles: { fontSize: '13px', color: '#a1b8d1' } },
                    { type: 'Paragraph', props: { text: 'Templates' }, styles: { fontSize: '13px', color: '#a1b8d1' } }
                ]},
                { type: 'Container', children: [
                    { type: 'Heading', props: { text: 'Company', level: 'h4' }, styles: { color: '#38bdf8', fontSize: '14px' } },
                    { type: 'Paragraph', props: { text: 'About Us' }, styles: { fontSize: '13px', color: '#a1b8d1' } },
                    { type: 'Paragraph', props: { text: 'Contact' }, styles: { fontSize: '13px', color: '#a1b8d1' } }
                ]}
            ]}
        ]
    }
};

window.ComponentRegistry = ComponentRegistry;
