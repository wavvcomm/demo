import React, { useState, useEffect } from "react";
import Table from "./Table";
import { Navbar, Logo } from "react-easy-navbar";
import { init, auth } from "@wavv/core";
import { openMessenger } from "@wavv/messenger";
import jwt from "jsonwebtoken";

const App = () => {
  const [numbers, setNumbers] = useState([
    {
      number: "(570) 387-0000",
      title: "10All circuits are busy now",
    },
    {
      number: "(409) 724-3137",
      title: "15SIT requires deposit",
    },
    {
      number: "(541) 967-0010",
      title: "1Number Disconnected",
    },
    {
      number: "(207) 775-4321",
      title: "23Time and Temp recording",
    },
    {
      number: "(619) 330-9640",
      title: "Welcome to inum.",
    },
    {
      number: "(718) 816-9901",
      title: "North Staten Island	",
    },
    {
      number: "(610) 797-0014",
      title: "Excuse me, please deposit five cents",
    },
    {
      number: "(330) 572-0999",
      title: "Continious ring",
    },
  ]);

  const authWavv = async () => {
    const issuer = "90d267ae9889abf5cb9e3539d213e99b";
    const signature =
      "c1577a7e48dd721e5783851898c51e2bc62f84da7a40ccade2d872e7d8ce7fd2";
    const userId = "644961";
    const payload = {
      userId,
    };
    const token = jwt.sign(payload, signature, { issuer, expiresIn: 3600 });
    try {
      init({ server: "stage1" });
      auth({ token });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    authWavv();
  }, []);

  const removeNumber = (index) => {
    const newNumbers = numbers.filter((number, i) => {
      return i !== index;
    });
    setNumbers(newNumbers);
  };
  const textNumber = (index) => {
    //add Wavv messaging functionality
    const params = {
      contactView: true,
      contact: {
        contactId: "123",
        numbers: ["8444545111", "5555554321"],
        name: "George Costanza",
        address: "2880 Broadway",
        city: "New York",
        avatarUrl: "https://www.example.com/image.jpg",
        subheading: "Vandelay Industries",
      },
    };

    openMessenger(params);
    console.log(index);
  };
  const callNumber = (index) => {
    //add Wavv calling functionality
    console.log(index);
  };

  return (
    <div>
      <Navbar backgroundColor="black" textColor="white">
        <Logo text="WAVV Demo" />
      </Navbar>
      <Table
        numberData={numbers}
        removeNumber={removeNumber}
        textNumber={textNumber}
        callNumber={callNumber}
      />
    </div>
  );
};

export default App;
