/*
 * Header Component
 *
 * This file is part of the React Native example App.
 *
 * Sergio Enrique Vargas <sergioenrique@me.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { Appbar } from 'react-native-paper';

//---------------------------------------------------------------------------------------
// Header Component
//---------------------------------------------------------------------------------------
export default function Header() {
  return (
    <Appbar.Header>
      <Appbar.Content title="React Native example" subtitle="Github repositories finder" />
    </Appbar.Header>
  );
}
