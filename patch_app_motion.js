const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add AnimatePresence and motion to imports
if (!code.includes('import { motion, AnimatePresence }')) {
  code = code.replace(/import React, \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';");
}

// Wrap the main content switches with AnimatePresence
const mainContentRegex = /(<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">)([\s\S]*?)(<\/main>)/;

code = code.replace(mainContentRegex, (match, open, content, close) => {
  // Find all {currentTab === ...} or {currentTab !== "dashboard" && ...} and wrap them?
  // Actually, we can just wrap the whole content inside a motion div keyed on currentTab.
  
  // However, there's DeviceInspectorBar, AutoDeviceScanner, QuickNavigationHub which are conditional on currentTab !== "dashboard".
  // The easiest way is to wrap all the tab content inside a <AnimatePresence mode="wait"> <motion.div key={currentTab}> ... </motion.div> </AnimatePresence>
  // Let's modify the file manually using sed or similar approach.
  return match;
});

// Since the file is large and regex might be brittle, let's just create a wrapper component inside App.tsx or apply it globally.
