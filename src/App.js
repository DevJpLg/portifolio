import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  LanguageIcon, BriefcaseIcon, AcademicCapIcon,
  SparklesIcon, CodeBracketIcon, ChatBubbleLeftRightIcon, ArrowDownTrayIcon, EnvelopeIcon,
  CpuChipIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const style = document.createElement('style');
style.innerHTML = `
@keyframes blink-cursor {
  0% { opacity: 1; }
  49% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 0; }
}
.blink-cursor {
  animation: blink-cursor 1s steps(1) infinite;
}
`;
if (typeof document !== "undefined" && !document.getElementById('blink-cursor-style')) {
  style.id = 'blink-cursor-style';
  document.head.appendChild(style);
}

const FloatingShape = ({ className }) => (
  <div className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-full opacity-10 dark:opacity-20 animate-float ${className}`}></div>
);

const sections = [
  { id: 'home', title: 'home', icon: HomeIcon },
  { id: 'about', title: 'about', icon: UserCircleIcon },
  { id: 'experience', title: 'experience', icon: BriefcaseIcon },
  { id: 'skills', title: 'skills', icon: CpuChipIcon },
  { id: 'certifications', title: 'certifications', icon: SparklesIcon },
  { id: 'projects', title: 'projects', icon: CodeBracketIcon },
  { id: 'education', title: 'education', icon: AcademicCapIcon },
  { id: 'contact', title: 'contact', icon: ChatBubbleLeftRightIcon },
];

function getMonthsSince(startYear, startMonth) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  let months = (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1;
  return Math.max(1, months);
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function App() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language.split('-')[0]);
  const [typedGreeting, setTypedGreeting] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [animationDone, setAnimationDone] = useState(false);
  const isMobile = useIsMobile();

  const handleSkillClick = (skillName) => {
    setExpandedSkill(expandedSkill === skillName ? null : skillName);
  };

  const sectionInViewProps = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: isMobile ? 0.05 : 0.3 }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18n.language.split('-')[0]);
  }, [i18n.language]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  const greetingPart = t('hero.greeting');
  const namePart = t('hero.name');
  const fullTextToType = greetingPart + " " + namePart;

  useEffect(() => {
    setTypedGreeting('');
    setAnimationDone(false);
    if (fullTextToType) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < fullTextToType.length) {
          setTypedGreeting(fullTextToType.substring(0, index + 1));
          index++;
        } else {
          clearInterval(intervalId);
          setAnimationDone(true);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [fullTextToType]);

  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const initialCertificatesToShow = 4;

  const certificationsSectionRef = useRef(null);

  const toggleShowAllCertificates = () => {
    if (showAllCertificates && certificationsSectionRef.current) {
      certificationsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowAllCertificates(!showAllCertificates);
  };

  // Card animation variants
  const cardVariants = isMobile
    ? { visible: { opacity: 1, y: 0, scale: 1 } }
    : {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
        }),
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
      };

  const sectionVariant = {
    hidden: { opacity: 0, y: isMobile ? 15 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.6 : 0.5, when: "beforeChildren", staggerChildren: isMobile ? 0.08 : 0.1 }
    }
  };

  const skillItemVariant = isMobile
    ? { visible: { opacity: 1, scale: 1, y: 0 } }
    : {
        hidden: { opacity: 1, scale: 0.8, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
      };

  const tagVariants = isMobile
    ? { visible: { opacity: 1, y: 0, scale: 1 } }
    : {
        hidden: { opacity: 0, y: 10, scale: 0.9 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
        }),
      };

  const contactIconVariant = isMobile
    ? { visible: { opacity: 1, y: 0, scale: 1 } }
    : {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: i * 0.15,
            duration: 0.4,
            ease: "easeOut"
          }
        })
      };

  const profilePhotoUrl = "/images/profile.webp";
  const linkedinProfileUrl = "https://www.linkedin.com/in/joaopedrolopesgoncalves/";
  const githubProfileUrl = "https://github.com/DevJpLg";
  const emailAddress = "joaopedro.lg@hotmail.com";

  const techColorMap = {
    "JavaScript": { bgColor: "bg-yellow-300", textColor: "text-yellow-800" },
    "CSS": { bgColor: "bg-blue-500", textColor: "text-white" },
    "React": { bgColor: "bg-sky-400", textColor: "text-sky-900" },
    "Python": { bgColor: "bg-green-400", textColor: "text-green-900" },
    "VBA": { bgColor: "bg-purple-500", textColor: "text-white" },
    "Oracle DB": { bgColor: "bg-red-600", textColor: "text-white" },
    "MS Power Platform": { bgColor: "bg-indigo-500", textColor: "text-white" },
    "Java": { bgColor: "bg-orange-500", textColor: "text-white" },
    "HTML": { bgColor: "bg-blue-500", textColor: "text-white" },
    "CSS3": { bgColor: "bg-sky-600", textColor: "text-white" },
    "Node.js": { bgColor: "bg-green-600", textColor: "text-white" },
    "SQL": { bgColor: "bg-teal-500", textColor: "text-white" },
    "Git": { bgColor: "bg-red-500", textColor: "text-white" },
    "VS Code": { bgColor: "bg-blue-500", textColor: "text-white" },
    "Power BI": { bgColor: "bg-yellow-400", textColor: "text-black" },
    "SharePoint": { bgColor: "bg-teal-600", textColor: "text-white" },
    "Office": { bgColor: "bg-orange-600", textColor: "text-white" },
  };

  const skillsList = [
    { name: "Python", logoPath: "/images/logos/python.svg" },
    { name: "Java", logoPath: "/images/logos/java.svg" },
    { name: "HTML5", logoPath: "/images/logos/html5.svg" },
    { name: "JavaScript", logoPath: "/images/logos/javascript.svg" },
    { name: "CSS3", logoPath: "/images/logos/css3.svg" },
    { name: "React", logoPath: "/images/logos/react.svg" },
    { name: "Oracle DB", logoPath: "/images/logos/oracle.svg" },
    { name: "VS Code", logoPath: "/images/logos/vscode.svg" },
    { name: "Git", logoPath: "/images/logos/git.svg" },
    { name: "GitHub", logoPath: "/images/logos/github.svg" },
    { name: "Power BI", logoPath: "/images/logos/powerbi.svg" },
    { name: "SharePoint", logoPath: "/images/logos/sharepoint.svg" },
    { name: "Office", logoPath: "/images/logos/office.svg" },
  ];

  const certificationsDataRaw = t('certifications.certificates', { returnObjects: true });
  const allCertificatesData = Array.isArray(certificationsDataRaw) ? certificationsDataRaw : [];

  const educationItemsDataRaw = t('education.items', { returnObjects: true });
  const educationItems = Array.isArray(educationItemsDataRaw) ? educationItemsDataRaw : [];

  const technipStartYear = 2024;
  const technipStartMonth = 9;

  const getFormattedMonthCountCallback = useCallback((months) => {
    if (months === 1) {
      return t('experience.monthCount.one', { count: months, defaultValue: "1 month" });
    }
    return t('experience.monthCount.other', { count: months, defaultValue: "{{count}} months" });
  }, [t]);

  const experienceJobsDataRaw = t('experience.jobs', { returnObjects: true });
  const rawJobs = useMemo(() => Array.isArray(experienceJobsDataRaw) ? experienceJobsDataRaw : [], [experienceJobsDataRaw]);
  const processedExperienceJobs = useMemo(() => {
    const technipMonths = getMonthsSince(technipStartYear, technipStartMonth);

    return rawJobs.map(job => {
      if (job.key === "technipfmc_pm") {
        const datePrefix = job.dates;
        const formattedMonthText = getFormattedMonthCountCallback(technipMonths);
        return {
          ...job,
          dates: `${datePrefix}${formattedMonthText}`
        };
      }
      return job;
    });
  }, [rawJobs, getFormattedMonthCountCallback]);
  const experienceJobs = processedExperienceJobs;

  const aboutKeyTechTagsDataRaw = t('about.keyTechTags', { returnObjects: true });
  const aboutKeyTechTags = Array.isArray(aboutKeyTechTagsDataRaw) ? aboutKeyTechTagsDataRaw : [];

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const response = await fetch(`https://api.github.com/users/DevJpLg/repos?sort=updated&direction=desc&per_page=6`);
        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setErrorProjects(error.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  let greetingDisplay = "";
  let nameDisplay = "";
  const spaceChar = " ";

  if (typedGreeting.length <= greetingPart.length) {
    greetingDisplay = typedGreeting;
  } else {
    greetingDisplay = greetingPart;
    if (typedGreeting.length > greetingPart.length + spaceChar.length) {
      nameDisplay = typedGreeting.substring(greetingPart.length + spaceChar.length);
    }
  }
  const showSpace = typedGreeting.length > greetingPart.length;

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    // Corrigir para que 'home' aponte para 'hero'
    const realTargetId = targetId === 'home' ? 'hero' : targetId;
    const element = document.getElementById(realTargetId);
    if (element) {
      const headerOffset = headerHeight;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsSidebarOpen(false);
  };

  const GITHUB_URL = "https://github.com/DevJpLg";
  const LINKEDIN_URL = "https://www.linkedin.com/in/joaopedrolopesgoncalves/";
  const EMAIL_ADDRESS = "joaopedro.lg@hotmail.com";

  const languagesData = [
    { name: t('skills.namePortuguese', 'Portuguese'), level: t('skills.levelFluent', 'Fluent'), flagSvg: "/images/flags/portuguese.svg" },
    { name: t('skills.nameEnglish', 'English'), level: t('skills.levelAdvanced', 'Advanced'), flagSvg: "/images/flags/english.svg" },
    { name: t('skills.nameSpanish', 'Spanish'), level: t('skills.levelBasic', 'Basic'), flagSvg: "/images/flags/spanish.svg" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.scroll-animate');
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => {
      elementsToAnimate.forEach(el => observer.unobserve(el));
    };
  }, []);

  const sectionTitleVariant = {
    hidden: { opacity: 0, y: isMobile ? 15 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: isMobile ? 0.7 : 0.6, ease: "easeOut" } }
  };

  const cvFileUrl = useMemo(() => {
    if (currentLanguage === 'pt') {
      return "/Joao_Pedro_CV_pt.pdf";
    }
    return "/Joao_Pedro_CV_en.pdf";
  }, [currentLanguage]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const [githubLangs, setGithubLangs] = useState({});
  const [loadingLangs, setLoadingLangs] = useState(true);

  useEffect(() => {
    async function fetchLanguages() {
      setLoadingLangs(true);
      let page = 1;
      let allRepos = [];
      try {
        while (true) {
          const resp = await fetch(`https://api.github.com/users/DevJpLg/repos?per_page=100&page=${page}`);
          const repos = await resp.json();
          if (!Array.isArray(repos) || repos.length === 0) break;
          allRepos = allRepos.concat(repos);
          if (repos.length < 100) break;
          page++;
        }
        const langCount = {};
        allRepos.forEach(repo => {
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
        });
        setGithubLangs(langCount);
      } catch {
        setGithubLangs({});
      } finally {
        setLoadingLangs(false);
      }
    }
    fetchLanguages();
  }, []);

  const githubLangsSorted = Object.entries(githubLangs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const githubLangsChartData = {
    labels: githubLangsSorted.map(([lang]) => lang),
    datasets: [
      {
        label: t('skills.languagesTitle', "Languages"),
        data: githubLangsSorted.map(([, count]) => count),
        backgroundColor: [
          '#facc15', '#38bdf8', '#22d3ee', '#f472b6', '#a3e635', '#f87171'
        ],
        borderRadius: 8,
      }
    ]
  };

  const githubLangsChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: 'end',
        align: 'right',
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value) => value,
        clamp: false,
        padding: {
          right: 40
        }
      }
    },
    layout: {
      padding: {
        right: 40
      }
    },
    scales: {
      x: {
        display: false,
        max: Math.max(...githubLangsSorted.map(([, count]) => count), 1) + 1
      },
      y: { grid: { color: '#444' }, ticks: { color: '#fff' } }
    }
  };

  const githubLangsChartRef = useRef(null);
  const isGithubLangsChartInView = useInView(githubLangsChartRef, { once: true, amount: isMobile ? 0.05 : 0.3 });

  return (
    <div className="min-h-screen flex flex-col relative bg-brand-purple-dark text-dark-text">
      <header ref={headerRef} className="sticky top-0 z-50 shadow-lg bg-brand-purple-dark/80 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center relative">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-dark-text md:mr-4"
              aria-label="Open navigation menu"
            >
              <Bars3Icon className="h-7 w-7" />
            </button>

            <a
              href={linkedinProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold flex items-center w-max 
                         absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                         md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
              style={{ minWidth: 0 }}
            >
              <span
                className="bg-clip-text text-transparent bg-gradient-accent"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t('hero.name')}
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button onClick={() => changeLanguage(currentLanguage === 'en' ? 'pt' : 'en')} className="btn-icon" aria-label="Change language">
                <LanguageIcon className="h-6 w-6" />
                <span className="ml-1 uppercase text-xs font-semibold">{currentLanguage}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-[55]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-brand-purple-light shadow-2xl z-[60] p-5 flex flex-col"
            >
              <div className="flex justify-end items-center mb-8">
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 hover:text-accent-magenta p-1">
                  <XMarkIcon className="h-7 w-7" />
                </button>
              </div>
              <nav className="flex-grow">
                <ul className="space-y-2">
                  {sections.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleNavClick(e, item.id)}
                        className="flex items-center py-2.5 px-3 rounded-lg text-md text-gray-200 hover:bg-brand-purple hover:text-white transition-colors duration-150 ease-in-out"
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{t(`nav.${item.title}`)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto pt-6 border-t border-brand-purple text-center">
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} {t('footer.ownerName')}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow" role="main">
        <section
          id="hero"
          className="relative py-20 md:py-32 text-center bg-gradient-to-br from-brand-purple-dark via-brand-purple to-accent-blue/40 flex flex-col items-center justify-center overflow-hidden px-4"
          style={{ minHeight: `calc(100vh - ${headerHeight}px)` }}
        >
          <div className="absolute inset-0 z-0">
            <FloatingShape className="top-[10%] left-[15%] bg-accent-magenta" />
            <FloatingShape className="bottom-[15%] right-[10%] bg-accent-blue" />
            <FloatingShape className="top-[30%] right-[25%] w-20 h-20 md:w-24 md:h-24 bg-accent-teal" />
            <FloatingShape className="bottom-[35%] left-[20%] w-10 h-10 md:w-12 md:h-12 bg-brand-purple-light" />
          </div>
          <div className="container mx-auto z-10 animate-fadeInUp">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={sectionTitleVariant}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-dark-text"
            >
              <span className="block sm:inline">
                {greetingDisplay}
                {showSpace && spaceChar}
              </span>
              <span
                className={
                  "block sm:inline bg-clip-text text-transparent bg-gradient-accent"
                }
              >
                {nameDisplay}
              </span>

              <span className="hidden sm:inline blink-cursor">
                {(typedGreeting.length < fullTextToType.length || animationDone) && '|'
                }
              </span>
            </motion.h1>
            <p className="text-xl sm:text-3xl md:text-3xl font-semibold mb-5 text-gray-300 max-w-3xl mx-auto">{t('hero.title')}</p>

            <p className="text-md sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-400">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href={`mailto:${emailAddress}`}
                className="btn-primary inline-block"
              >
                <EnvelopeIcon className="h-5 w-5 inline-block mr-2" /> {t('hero.contactButtonHero')}
              </a>
              <a
                href={cvFileUrl}
                download
                className="btn-secondary inline-block"
              >
                <ArrowDownTrayIcon className="h-5 w-5 inline-block mr-2" /> {t('hero.downloadCV')}
              </a>
            </div>
          </div>
        </section>

        <section id="about" className={`py-16 md:py-20 bg-brand-purple text-dark-text overflow-hidden`}>
          <div className="container mx-auto px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center"
            >
              <i className="bi bi-person-circle mr-3 text-3xl md:text-4xl text-accent-magenta"></i> {t('about.title')}
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              <div className="w-56 h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 flex-shrink-0 rounded-full overflow-hidden shadow-2xl border-4 border-accent-blue transform transition-all duration-500 hover:scale-105">
                <img
                  src={profilePhotoUrl}
                  alt={t('hero.name')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left flex-grow">
                <p className="mb-4 text-base md:text-lg leading-relaxed text-gray-300">{t('about.paragraph1')}</p>
                <p className="mb-6 text-base md:text-lg leading-relaxed text-gray-300">{t('about.paragraph2')}</p>

                <p className="text-lg font-semibold mb-2 text-accent-blue">
                  {t('about.topSkills', 'Top 5 Skills')}
                </p>
                <div className="mb-6 text-center md:text-left">
                  <motion.div
                    className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
                  >
                    {aboutKeyTechTags.map((tagObj, index) => {
                      const colors = techColorMap[tagObj.name] || { bgColor: "bg-gray-700", textColor: "text-gray-200" };
                      return (
                        <motion.span
                          key={tagObj.name}
                          custom={index}
                          variants={tagVariants}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-md
                                      ${colors.bgColor} ${colors.textColor}
                                      transform transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                        >
                          {tagObj.name}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                </div>

                <div className="space-y-2 text-sm md:text-base text-gray-400">
                  <a
                    href={t('about.locationUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start hover:text-accent-teal transition-colors"
                  >
                    <i className="bi bi-geo-alt-fill mr-2 text-accent-teal"></i> {t('about.location')}
                  </a>
                  <a
                    href={t('about.connectionsUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start hover:text-accent-teal transition-colors"
                  >
                    <i className="bi bi-people-fill mr-2 text-accent-teal"></i> {t('about.connections')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <motion.section
          id="experience"
          className={`py-12 md:py-16 bg-brand-purple-dark text-dark-text`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.05 }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 flex items-center justify-center"
            >
              <BriefcaseIcon className="h-8 w-8 mr-3 text-accent-teal" />
              {t('experience.title')}
            </motion.h2>
            <div className="max-w-3xl mx-auto space-y-10">
              {experienceJobs.map((job, index) => (
                <div
                  key={job.key || index}
                  className="bg-brand-purple-light rounded-xl shadow-2xl overflow-hidden" // removido card-hover-effect
                >
                  <div className="p-6 md:p-8">
                    {/* Mantém motion.div para conteúdo interno se desejar animação interna, 
                        mas pode remover também se quiser tudo estático */}
                    <div className="flex flex-col sm:flex-row items-start mb-4">
                      {job.logo && (
                        <a
                          href="https://www.technipfmc.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${job.company} website`}
                          className="mr-5 mb-3 sm:mb-0 flex-shrink-0"
                        >
                          <img
                            src={job.logo}
                            alt={`${job.company} Logo`}
                            className="h-12 w-12 md:h-14 md:w-14 bg-slate-200 p-1 rounded-md object-contain"
                          />
                        </a>
                      )}
                      <div className="flex-grow">
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{job.title}</h3>
                        <p className="text-md font-semibold text-accent-blue">{job.company}</p>
                        <div className="text-xs text-gray-400 mt-1 space-x-2">
                          <span><i className="bi bi-calendar-event mr-1"></i>{job.dates}</span>
                          <span>
                            <i className="bi bi-geo-alt-fill mr-1"></i>
                            {job.locationUrl ? (
                              <a
                                href={job.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent-teal"
                              >
                                {job.location.split(' · ')[0]}
                              </a>
                            ) : (
                              job.location.split(' · ')[0]
                            )}
                            {job.location.includes('·') ? ` · ${job.location.split(' · ')[1]}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 mt-4">{t('experience.responsibilitiesTitle', 'Responsibilities')}</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {Array.isArray(job.responsibilities) && job.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start">
                            <i className="bi bi-check-circle-fill text-accent-blue mt-1 mr-2 flex-shrink-0"></i>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {Array.isArray(job.achievements) && job.achievements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('experience.achievementsTitle', 'Key Achievements')}:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <i className="bi bi-star-fill text-accent-magenta mt-1 mr-2 flex-shrink-0"></i>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="skills"
          className={`py-16 md:py-24 bg-brand-purple text-dark-text`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.05 }}
        >
          <div className="container mx-auto px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 flex items-center justify-center"
            >
              <CpuChipIcon className="h-8 w-8 mr-3 text-accent-magenta" />
              {t('skills.title')}
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 max-w-5xl mx-auto">
              {skillsList.map((skill, index) => {
                const isExpanded = expandedSkill === skill.name;
                const skillKey = skill.name.replace(/ /g, '');
                return (
                  <React.Fragment key={skill.name}>
                    <motion.div
                      layout
                      onClick={() => handleSkillClick(skill.name)}
                      // Remover transition do framer-motion, usar apenas Tailwind para suavidade
                      className={`relative bg-brand-purple-light p-4 md:p-6 rounded-xl shadow-xl text-center card-hover-effect flex flex-col items-center justify-start cursor-pointer aspect-square hover:scale-105 transition-all duration-200 ease-out ${isExpanded ? 'z-10 border-2 border-accent-blue shadow-2xl scale-105' : 'border-2 border-transparent'}`}
                    >
                      <motion.div layout="position" className="flex flex-col items-center w-full">
                        {skill.logoPath && (
                          <img
                            src={skill.logoPath}
                            alt={`${skill.name} logo`}
                            className="h-12 w-12 md:h-16 md:w-16 mb-3 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        {skill.IconComponent && (
                          <skill.IconComponent className="h-12 w-12 md:h-16 md:w-16 mb-3 text-accent-blue" />
                        )}
                        {!skill.logoPath && !skill.IconComponent && (
                          <CpuChipIcon className="h-12 w-12 md:h-16 md:w-16 mb-3 text-gray-500" />
                        )}
                        <div className="flex items-center justify-center w-full">
                          <p className="text-sm md:text-base font-semibold text-gray-200 mt-2">{skill.name}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>
            <AnimatePresence>
              {expandedSkill && (
                <motion.div
                  key="popup"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="fixed inset-0 z-50 flex items-center justify-center" // removido bg-black/60
                  onClick={() => setExpandedSkill(null)}
                >
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative bg-brand-purple-dark rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-gray-200"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-accent-magenta text-xl"
                      onClick={() => setExpandedSkill(null)}
                      aria-label="Close"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div className="flex flex-col items-center mb-4">
                      {skillsList.find(s => s.name === expandedSkill)?.logoPath && (
                        <img
                          src={skillsList.find(s => s.name === expandedSkill)?.logoPath}
                          alt={`${expandedSkill} logo`}
                          className="h-14 w-14 md:h-20 md:w-20 mb-3 object-contain"
                        />
                      )}
                      <p className="text-lg font-bold mb-2">{expandedSkill}</p>
                    </div>
                    <p className="text-base text-gray-300">{t(`skills.details.${expandedSkill.replace(/ /g, '')}`)}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="mt-16 md:mt-20 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h3
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
                variants={sectionTitleVariant}
                className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 flex items-center justify-center"
              >
                <LanguageIcon className="h-7 w-7 mr-3 text-accent-blue" />
                {t('skills.languagesTitle', "Languages")}
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {languagesData.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    custom={index}
                    variants={skillItemVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
                    className="bg-brand-purple-light p-5 rounded-xl shadow-lg text-center card-hover-effect flex flex-col items-center justify-center"
                  >
                    {lang.flagSvg && (
                      <img
                        src={lang.flagSvg}
                        alt={`${lang.name} flag`}
                        className="h-10 w-10 mb-2 object-contain"
                      />
                    )}
                    <p className="text-lg font-semibold text-gray-100">{lang.name}</p>
                    <p className="text-sm text-gray-300">{lang.level}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.section>

        <section id="certifications" ref={certificationsSectionRef} className={`py-16 md:py-24 bg-brand-purple-dark text-dark-text`}>
          <div className="container mx-auto px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className={`text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center`}
            >
              <AcademicCapIcon className="h-8 w-8 mr-3 text-accent-teal" />
              {t('certifications.title')}
            </motion.h2>

            <motion.div
              layout
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              <AnimatePresence>
                {allCertificatesData.slice(0, showAllCertificates ? allCertificatesData.length : initialCertificatesToShow).map((cert, index) => (
                  <motion.div
                    key={cert.key}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`p-6 rounded-xl shadow-xl card-hover flex flex-col bg-brand-purple-light text-dark-text`}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={cert.logo}
                        alt={`${cert.issuer} logo`}
                        className={
                          cert.issuer === "Udemy"
                            ? "h-10 w-10 mr-4 object-contain rounded-none bg-transparent p-0"
                            : "h-10 w-10 mr-4 object-contain bg-slate-300 p-1 rounded-sm"
                        }
                        style={cert.issuer === "Udemy" ? { background: "transparent", padding: 0 } : {}}
                      />
                      <div>
                        <h3 className="text-lg md:text-xl font-bold leading-tight">{cert.name}</h3>
                        <p className={`text-sm font-semibold text-gray-300`}>{cert.issuer}</p>
                      </div>
                    </div>
                    <p className={`text-xs text-gray-400 mb-1`}>{cert.date}</p>
                    <p className={`text-xs text-gray-400 mb-3`}>
                      ID: {cert.credentialId}
                    </p>

                    <div className="mb-4 mt-auto">
                      <p className={`text-sm font-semibold mb-1 text-gray-200`}>Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(cert.skills) && cert.skills.map(skill => (
                          <span key={skill} className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={cert.credentialUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-accent-blue hover:underline self-start"
                    >
                      {t('certifications.showCredentialText')} <i className="bi bi-box-arrow-up-right ml-1"></i>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {allCertificatesData.length > initialCertificatesToShow && (
              <div className="text-center mt-12">
                <motion.button
                  onClick={toggleShowAllCertificates}
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showAllCertificates ? t('certifications.showLess') : t('certifications.showMore')}
                </motion.button>
              </div>
            )}
          </div>
        </section>

        <section id="projects" className={`py-16 md:py-24 bg-brand-purple text-dark-text`}>
          <div className="container mx-auto px-6">
            <motion.h2
              {...sectionInViewProps}
              variants={sectionTitleVariant}
              className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center"
            >
              <CodeBracketIcon className="h-8 w-8 mr-3 text-accent-teal" /> {t('projects.title')}
            </motion.h2>

            {loadingProjects && (
              <p className="text-center text-gray-300 py-8">{t('projects.loading', 'Loading projects...')}</p>
            )}
            {errorProjects && (
              <p className="text-center text-red-400 py-8">
                {t('projects.error', 'Failed to load projects.')} ({errorProjects})
              </p>
            )}
            {!loadingProjects && !errorProjects && projects.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                {t('projects.noProjects', 'No public projects to display at the moment.')}
              </p>
            )}

            {!loadingProjects && !errorProjects && projects.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    custom={index}
                    variants={cardVariants}
                    initial={isMobile ? false : "hidden"}
                    animate={isMobile ? "visible" : undefined}
                    whileInView={isMobile ? undefined : "visible"}
                    viewport={isMobile ? undefined : { once: true, amount: 0.2 }}
                    className="bg-brand-purple-light p-6 rounded-xl shadow-xl card-hover-glow flex flex-col"
                  >
                    <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
                    <p className="text-sm text-gray-300 mb-3 flex-grow">{project.description || t('projects.noDescription', 'No description available.')}</p>
                    {project.language && (
                      <p className="text-xs font-semibold text-accent-blue mb-1">
                        Language: {project.language}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-400 mb-3">
                      <i className="bi bi-star-fill mr-1 text-yellow-400"></i> {project.stargazers_count}
                      <i className="bi bi-git mr-1 ml-3 text-gray-300"></i> {project.forks_count}
                    </div>
                    {Array.isArray(project.topics) && project.topics.length > 0 && (
                      <div className="mb-3">
                        {project.topics.slice(0, 3).map(topic => (
                          <span key={topic} className="inline-block bg-accent-blue/20 text-accent-blue text-xs px-2 py-0.5 rounded-full mr-1 mb-1">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-accent-teal hover:underline mt-auto self-start"
                    >
                      {t('projects.viewProject', 'View Project')} <i className="bi bi-box-arrow-up-right ml-1"></i>
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {t('projects.seeMore', 'See More on GitHub')} <i className="bi bi-github ml-2"></i>
              </a>
            </div>

            {/* Gráfico de linguagens do GitHub movido para o final da seção */}
            <motion.div
              {...sectionInViewProps}
              variants={sectionVariant}
              className="w-full max-w-4xl mx-auto mt-16 bg-brand-purple-light rounded-xl p-6 shadow-lg"
              ref={githubLangsChartRef}
            >
              <h3 className="text-xl font-bold mb-4 text-center text-accent-blue">
                {t('projects.mostUsedLanguages', 'Most used Languages - GitHub')}
              </h3>
              {isGithubLangsChartInView ? (
                loadingLangs ? (
                  <p className="text-center text-gray-300">{t('projects.loading', 'Loading...')}</p>
                ) : githubLangsSorted.length === 0 ? (
                  <p className="text-center text-gray-400">{t('projects.noProjects', 'No data')}</p>
                ) : (
                  <Bar data={githubLangsChartData} options={githubLangsChartOptions} height={180} plugins={[ChartDataLabels]} />
                )
              ) : (
                <div style={{ height: 180 }}></div>
              )}
            </motion.div>
          </div>
        </section>
        <motion.section
          id="education"
          className={`py-16 md:py-24 bg-brand-purple-dark text-dark-text`}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.1 }}
        >
          <div className="container mx-auto px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center"
            >
              <AcademicCapIcon className="h-8 w-8 mr-3 text-accent-teal" />
              {t('education.title')}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {educationItems.map((edu, index) => (
                <motion.div
                  key={edu.institution + index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-brand-purple-light rounded-xl shadow-lg flex flex-col h-full"
                >
                  <div className="flex flex-row items-start">
                    {edu.logo && (
                      <img
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        className="h-12 w-12 md:h-14 md:w-14 mr-5 mb-3 sm:mb-0 flex-shrink-0 rounded-md object-contain"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white leading-tight">{edu.institution}</h3>
                      <p className="text-md font-semibold text-accent-blue">{edu.degree}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-auto self-end pt-2">{edu.dates}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <section id="contact" className={`py-16 md:py-24 bg-brand-purple text-dark-text`}>
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
              variants={sectionTitleVariant}
              className={`text-3xl md:text-4xl font-bold mb-12 flex items-center justify-center`}
            >
              <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3 text-accent-magenta" />
              {t('contact.title')}
            </motion.h2>
            <div className="flex flex-wrap justify-center items-start gap-6 md:gap-10">
              {[
                { key: 'linkedin', href: LINKEDIN_URL, label: 'LinkedIn', icon: 'bi bi-linkedin' },
                { key: 'github', href: GITHUB_URL, label: 'GitHub', icon: 'bi bi-github' },
                { key: 'email', href: `mailto:${EMAIL_ADDRESS}`, label: 'Email', icon: 'bi bi-envelope-fill' },
              ].map((contactItem, idx) => (
                <motion.a
                  key={contactItem.key}
                  href={contactItem.href}
                  target={contactItem.key === 'email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={contactItem.label}
                  className="flex flex-col items-center text-gray-300 hover:text-accent-blue transition-colors duration-300 group"
                  custom={idx}
                  variants={contactIconVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: isMobile ? 0.05 : 0.3 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`${contactItem.icon} text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110`}></i>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center bg-brand-purple-dark text-gray-400">
        <div className="container mx-auto px-6">
          <p className="text-sm">{t('footer.text', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;