import { motion } from 'framer-motion';

const paragraphs = [
  {
    title: 'Welcome to Yangon TV',
    phrases: [
      'Yangon TV', 'is', "Myanmar's", 'home', 'for', 'cinematic', 'storytelling', '—',
      'where', 'global', 'films', 'and', 'series', 'meet', 'Burmese', 'hearts.',
    ],
  },
  {
    title: '',
    phrases: [
      'We', 'craft', 'original', 'recap', 'videos,', 'background', 'commentary,',
      'summaries,', 'and', 'carefully', 'translated', 'Burmese', 'subtitles,',
      'bringing', 'world-class', 'stories', 'closer', 'to', 'our', 'audience.',
    ],
  },
  {
    title: '',
    phrases: [
      'Our', 'mission', 'is', 'simple:', 'to', 'make', 'great', 'cinema',
      'accessible,', 'enjoyable,', 'and', 'meaningful', 'for', 'every', 'Myanmar', 'viewer.',
    ],
  },
  {
    title: '',
    phrases: [
      'Every', 'frame', 'we', 'present', 'is', 'guided', 'by', 'respect', '—',
      'for', 'the', 'original', 'creators,', 'for', 'copyright', 'law,',
      'and', 'above', 'all,', 'for', 'you,', 'our', 'audience.',
    ],
  },
  {
    title: '',
    phrases: [
      'Thank', 'you', 'for', 'being', 'part', 'of', 'our', 'journey.',
    ],
  },
];

const dropVariant = {
  hidden: {
    opacity: 0,
    y: -40,
    x: (Math.random() - 0.5) * 30,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.9,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const titleVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function About() {
  let globalIndex = 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          About Us
        </h1>
        <div className="w-20 h-1 bg-red-500 mx-auto rounded-full" />
      </div>

      <div className="space-y-10">
        {paragraphs.map((para, paraIdx) => {
          const phrases = para.phrases;
          const indices = phrases.map(() => globalIndex++);

          return (
            <div key={paraIdx} className="text-center">
              {para.title && (
                <motion.h2
                  custom={indices[0]}
                  variants={titleVariant}
                  initial="hidden"
                  animate="visible"
                  className="text-2xl md:text-3xl font-bold text-red-500 mb-6"
                >
                  {para.title}
                </motion.h2>
              )}
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {phrases.map((word, wordIdx) => (
                  <motion.span
                    key={wordIdx}
                    custom={indices[wordIdx]}
                    variants={dropVariant}
                    initial="hidden"
                    animate="visible"
                    className="inline-block mx-0.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </div>
          );
        })}

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: globalIndex * 0.12 + 0.5, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-lg italic">
            — The Yangon TV Team
          </p>
        </motion.div>
      </div>
    </div>
  );
}
