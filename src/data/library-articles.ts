export interface Article {
  id: string;
  title: string;
  description: string;
  type: "article" | "audio";
  duration: string;
  category: string;
  ageRange: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Sleep windows by age",
    description: "Understand how long your baby should stay awake",
    type: "article",
    duration: "3 min",
    category: "Sleep",
    ageRange: "0-3 months",
    content: `## What are sleep windows?

Sleep windows are the periods when the baby stays awake between one nap and another. Respecting these windows is essential to prevent the baby from getting **overtired** — which, ironically, makes sleep difficult.

### By age

**0 to 1 month:** 45 minutes to 1 hour
The newborn has very little awake time. If they have been awake for more than 1 hour, they are probably ready to sleep again.

**1 to 2 months:** 1 hour to 1h30
Start observing signs of tiredness: rubbing eyes, yawning, staring.

**2 to 3 months:** 1h15 to 1h45
At this stage, the baby begins to have a more predictable pattern. Take the opportunity to create a mini routine before naps.

### Signs the window has passed

- Baby gets irritated or tearful for no apparent reason
- Difficulty falling asleep even when tired
- Very short naps (less than 30 minutes)

### Practical tip

Use a timer on your phone to monitor awake time. Over time, you will notice the signs naturally, but in the beginning, the timer is a great ally.

> **Remember:** every baby is unique. These times are references, not rigid rules. Always observe your baby.`,
  },
  {
    id: "2",
    title: "White noise: benefits and care",
    description: "How to use sounds to calm the baby",
    type: "article",
    duration: "5 min",
    category: "Sleep",
    ageRange: "0-6 months",
    content: `## Why does white noise work?

Inside the womb, the baby hears constant sounds — blood flow, heartbeat, and the mother's body noises. This continuous sound is **comforting** and familiar.

White noise mimics this environment and helps the baby to:

- **Fall asleep faster**
- **Stay asleep** longer
- **Block out noises** from the environment (TV, conversations, dog)

### How to use correctly

**Volume:** Never exceed 50-60 dB (about the volume of a shower). Very loud sounds can damage the baby's hearing.

**Distance:** Keep the sound source at least 1 meter away from the crib.

**Type:** Prefer continuous and monotonous sounds (rain, fan, static). Avoid sounds with sudden variations.

**Duration:** Can be used during the entire sleep period, but try to gradually reduce after 6 months.

### Important precautions

⚠️ **Do not use headphones** on the baby — ever.

⚠️ **Do not leave the phone inside the crib** as a sound source.

⚠️ After 12 months, start decreasing usage so the baby learns to sleep without it.

### Alternatives to white noise

- Fan on in the room (directed away from the baby)
- Music box songs at low volume
- Nature sounds (rain, ocean waves)

> **Tip:** In Dr. Sleepy's Audio Library section you find lullabies perfect for baby sleep.`,
  },
  {
    id: "3",
    title: "Signs of hunger vs tiredness",
    description: "Learn to differentiate your baby's signs",
    type: "article",
    duration: "4 min",
    category: "Feeding",
    ageRange: "0-12 months",
    content: `## The most common confusion for parents

One of the biggest challenges of the first months is knowing **why** the baby is crying. Often, signs of hunger and tiredness look alike — and confusing them can make both feeding and sleep difficult.

### Signs of HUNGER

**Early (time to feed):**
- Turning head to sides (rooting reflex)
- Bringing hands to mouth
- Making sucking movements with lips
- Getting restless and moving a lot

**Late (already very hungry):**
- Intense crying and agitation
- Tense and rigid body
- Difficult to calm down

### Signs of TIREDNESS

**Early (time to sleep):**
- Rubbing eyes or ears
- Yawning
- Staring or "glazed" look
- Decreasing activity

**Late (overtired):**
- Crying for no apparent reason
- Arching back
- Extreme irritability
- Resisting being held

### How to differentiate in practice

| Sign | Hunger | Tiredness |
|-------|------|---------|
| Hands in mouth | ✅ Frequent | ❌ Rare |
| Yawning | ❌ Rare | ✅ Frequent |
| Seeks breast/bottle | ✅ Yes | ❌ No |
| Heavy eyes | ❌ No | ✅ Yes |
| Calms when nursing | ✅ Yes | ⚠️ Temporary |

### Golden tip

Note feeding and sleep times in the **Routine** tab of Dr. Sleepy. With a few days of logging, it becomes much easier to predict if it's time to eat or sleep.

> **Important:** If the baby fed recently (less than 1-2 hours ago), it is more likely that the crying is from tiredness, discomfort, or another need.`,
  },
  {
    id: "4",
    title: "Night sleep routine",
    description: "Step by step to create an effective routine",
    type: "article",
    duration: "6 min",
    category: "Routine",
    ageRange: "3-6 months",
    content: `## Why does routine matter so much?

Babies can't read clocks, but they recognize **patterns**. When you repeat the same actions before sleep, the baby's brain begins to associate these activities with sleep. It's like giving a warning: "hey, it's getting time to rest."

### The ideal routine (30-45 minutes before sleep)

**Step 1 — Warm bath** 🛁
A relaxing bath helps lower body temperature, signaling to the body that it's time to rest. It doesn't need to be long — 5 to 10 minutes is enough.

**Step 2 — Gentle massage** ✋
After the bath, give a light massage with oil or moisturizer. Circular movements on the tummy and legs. This reduces cortisol (stress hormone).

**Step 3 — Change clothes and prepare the environment** 🌙
Put on pajamas, darken the room, turn on white noise (if using), and reduce stimuli.

**Step 4 — Calm feeding** 🍼
The last feeding of the day should be quiet. Avoid play or visual stimuli during feeding.

**Step 5 — Lullaby or story** 📖
It can be a soft song, a short story, or simply talking quietly. The important thing is that it's always the same ritual.

**Step 6 — Place in crib drowsy, but awake** 😴
This is the most challenging step, but also the most important in the long run. The baby who learns to fall asleep in the crib will have an easier time falling back asleep when waking up at night.

### Common mistakes

❌ Varying the routine every day
❌ Doing stimulating activities near bedtime
❌ Waiting for the baby to be exhausted to start the routine
❌ Skipping steps when tired (consistency is key!)

### How long does it take to work?

Most babies respond to routine in **1 to 3 weeks**. Be patient and consistent — the results will come.

> **Use Dr. Sleepy:** Log in the Routine tab the time you start the ritual every night. This helps the AI give increasingly personalized guidance.`,
  },
  {
    id: "5",
    title: "Meditation for tired parents",
    description: "5 minutes of guided relaxation",
    type: "article",
    duration: "5 min",
    category: "Wellness",
    ageRange: "All",
    content: `## You need to rest too

Caring for a baby is exhausting — physically and emotionally. Many parents forget to take care of themselves while trying to give the best for their child. But the truth is: **a rested parent cares better**.

### 4-7-8 breathing exercise

This simple technique activates the parasympathetic nervous system, helping the body relax:

1. **Inhale** through your nose counting to **4**
2. **Hold** your breath counting to **7**
3. **Exhale** through your mouth counting to **8**

Repeat 4 times. You can do it sitting, lying down, or even standing with the baby in your arms.

### Body scan (3 minutes)

Close your eyes and mentally "scan" each part of your body:

1. Start with your **feet** — notice any tension and release
2. Move up to your **legs** — consciously relax
3. **Belly** — breathe deep and release
4. **Shoulders and neck** — where most parents accumulate tension
5. **Face** — relax forehead, jaw, eyes

### Affirmations for the difficult moment

When you are at your limit, repeat to yourself:

- *"I am doing the best I can, and that is enough."*
- *"This phase is temporary. It will pass."*
- *"Asking for help is not weakness, it is wisdom."*
- *"My baby doesn't need a perfect parent, they need a present parent."*

### When to seek more help

If you feel:
- Deep sadness that doesn't go away
- Uncontrollable anger
- Desire to distance yourself from the baby
- Scary thoughts

**Seek professional help.** Postpartum depression affects both mothers and fathers and is treatable. You are not alone.`,
  },
  {
    id: "6",
    title: "Sleep regression: what to expect",
    description: "Why sleep might get worse temporarily",
    type: "article",
    duration: "5 min",
    category: "Sleep",
    ageRange: "4-6 months",
    content: `## What is sleep regression?

Everything was going well — the baby slept long hours, naps were predictable, and then... suddenly, everything changes. They wake up several times at night, refuse naps, and seem to have unlearned how to sleep.

Calm down. This is a **sleep regression** and it is completely **normal**.

### Why does it happen?

Regressions happen when the baby's brain is going through major developmental changes:

**4 months** — The most famous one. The baby's sleep pattern matures and starts having cycles like an adult's. It's a permanent change (and a positive one!), but the adaptation period can be tough.

**6 months** — Coincides with the start of complementary feeding and, in some babies, the eruption of first teeth.

**8-10 months** — Period of motor milestones (sitting, crawling, standing). The brain wants to "practice" these new skills — even at night.

**12 months** — Transition from 2 to 1 nap. Can cause confusion in the routine.

**18 months** — Separation anxiety at its peak + language development.

### What to do during a regression

✅ **Stick to the routine** — Don't change everything because of the regression
✅ **Offer comfort** — The baby needs security at this moment
✅ **Be patient** — Most regressions last 2 to 4 weeks
✅ **Take care of yourself** — Take turns with your partner if possible

### What NOT to do

❌ Create new habits you don't want to keep (e.g., bringing to parents' bed if that wasn't the plan)
❌ Eliminate daytime naps thinking it will improve the night
❌ Despair — this will pass!

### When to worry

If the regression lasts more than 6 weeks or is accompanied by persistent fever, weight loss, or other symptoms, consult the pediatrician.

> **Tip:** Use Dr. Sleepy's chat to report what is happening. Based on routine logs, the AI can help identify if it is regression or another factor.`,
  },
  {
    id: "7",
    title: "Colic: how to relieve",
    description: "Understand colic and techniques to calm the baby",
    type: "article",
    duration: "5 min",
    category: "Wellness",
    ageRange: "0-3 months",
    content: `## What is colic?

Colic is episodes of intense crying, without apparent cause, that usually happen in the late afternoon or evening. It affects about **20-25% of babies** and usually starts around 2 weeks of life, peaking at 6 weeks.

### The rule of 3

Pediatricians define colic by the "rule of 3":
- Crying for more than **3 hours** a day
- On more than **3 days** a week
- For more than **3 weeks** straight

### Relief techniques

**Airplane position** ✈️
Place the baby face down on your forearm, with their head resting on your hand. The pressure on the tummy helps relieve gas.

**Tummy massage** 🤲
Circular movements clockwise around the belly button. Use warm almond oil to make it more comfortable.

**Bicycle legs** 🚲
With the baby lying on their back, move their little legs as if they were pedaling. This helps release trapped gas.

**Warm bath** 🛁
Warm water relaxes the abdominal muscles and helps relieve pain.

**White noise** 🔊
Continuous sound (vacuum cleaner, hair dryer, white noise app) helps distract and calm the baby during crises.

### What to avoid

❌ Shaking the baby forcefully (risk of shaken baby syndrome)
❌ Changing milk/formula without pediatric guidance
❌ Blaming yourself — colic is NOT the parents' fault

### When does it pass?

The good news: colic disappears spontaneously between **3 and 4 months** of life. Until then, patience and taking turns between caregivers are essential.

> **Important:** If the crying is accompanied by fever, vomiting, or feeding refusal, seek the pediatrician.`,
  },
  {
    id: "8",
    title: "Teething and sleep: what changes",
    description: "How teeth affect baby sleep",
    type: "article",
    duration: "4 min",
    category: "Sleep",
    ageRange: "6-12 months",
    content: `## When do teeth start coming in?

The first teeth usually appear between **6 and 10 months**, but can appear earlier or later. The complete process lasts until 2-3 years.

### Signs of teething

- Swollen and red gums
- Excessive salivation (drooling a lot)
- Biting everything they find
- Irritability and crying
- Low fever (up to 37.5°C / 99.5°F)
- Sleep disturbances

### How teething affects sleep

Teething discomfort is **more intense at night** because there are fewer distractions. The baby may:

- Wake up more times during the night
- Have difficulty falling asleep
- Take shorter naps
- Refuse breast/bottle due to gum pain

### What to do

**Cold teethers** 🧊
Put the teether in the fridge (not the freezer). The cold relieves gum inflammation.

**Gum massage** 🤲
With a clean finger, gently massage the baby's gum. The pressure helps relieve pain.

**Paracetamol or ibuprofen** 💊
Only with pediatrician's guidance and in the correct dose for the baby's weight. Never medicate on your own.

**Maintain routine** 🌙
The temptation is to change everything, but keeping the sleep routine helps the baby feel safe during this period.

### What NOT to use

⚠️ **Anesthetic gels** — can be dangerous for babies
⚠️ **Amber necklaces** — risk of strangulation and choking, without scientific proof
⚠️ **Honey on gums** — prohibited for under 1 year (risk of botulism)

> **Tip:** Log in Dr. Sleepy's Routine the teething periods so the AI considers this factor in sleep guidance.`,
  },
  {
    id: "9",
    title: "Ideal sleep environment",
    description: "How to prepare the perfect room for baby to sleep",
    type: "article",
    duration: "4 min",
    category: "Sleep",
    ageRange: "0-12 months",
    content: `## The baby's room matters (a lot!)

The environment where the baby sleeps directly influences the **quality and duration** of sleep. Small adjustments can make a big difference.

### Ideal temperature

The room should be between **20°C and 22°C** (68°F - 72°F). Babies sleep better in slightly cool environments.

**How to know if baby is comfortable:**
- Touch the nape or chest — should be warm, not hot
- Cold hands and feet are normal and do NOT indicate they are cold
- If sweating, it is too hot

### Darkness

Melatonin (sleep hormone) is produced in the dark. For night sleep:

- Use **blackout curtains** — investment worth every penny
- Cover electronic device lights
- Use red or amber light if you need to see during the night (never white or blue)

### Noise

- **Total silence** can be counterproductive — any noise wakes the baby
- **Constant white noise** masks environmental sounds and helps maintain sleep
- Keep volume below 50-60 dB

### The safe crib

- **Firm** mattress and exact size of the crib
- No pillows, loose blankets, stuffed animals, or bumpers
- Baby always **on their back**
- No spaces between mattress and sides

### Room checklist

- [ ] Temperature between 20-22°C
- [ ] Dark (blackout curtain)
- [ ] White noise on
- [ ] Crib free of loose objects
- [ ] Sleepwear suitable for temperature
- [ ] Humidifier if air is dry

> **Important:** Pediatric Societies recommend the baby sleeps in parents' room (but in their own crib) until 6 months of age.`,
  },
  {
    id: "10",
    title: "Introduction to solids and sleep",
    description: "How complementary feeding influences sleep",
    type: "article",
    duration: "5 min",
    category: "Feeding",
    ageRange: "6-12 months",
    content: `## Everything changes from 6 months on

Introduction to solids is an important milestone that can affect baby sleep — for better or worse. Understanding this relationship helps navigate this phase more peacefully.

### The myth of "eat more, sleep more"

Many parents believe that introducing solids will make the baby sleep through the night immediately. **This is a myth.** In fact, digestion of new foods can cause gases or discomfort initially, temporarily disrupting sleep.

### How to organize dinner

To favor sleep, dinner should happen **1h30 to 2 hours before bedtime**.

**Why?**
- Allows time for digestion
- Avoids sleeping with a very full stomach
- Gives time for the bedtime milk (which continues being important!)

### Foods that help sleep (Tryptophan rich)

- Banana
- Oats
- Avocado
- Sweet potato
- Chicken
- Egg

### Foods to avoid at night

- Foods with caffeine (chocolate)
- Very sugary foods (cause energy spikes)
- New foods (offer at lunch to observe allergies)

### The role of milk

Until 1 year, milk (breast or formula) is still the main source of nutrition. Do not replace night feedings with water or tea abruptly.

> **Tip:** If the baby starts waking up more after starting solids, check if dinner is too close to bedtime or if any specific food caused discomfort.`,
  }
];
