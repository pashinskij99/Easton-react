import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import useAuth from "../contexts/AuthContext";
import { useSelector } from "react-redux";
import { selectUser } from "../store/auth";
import { cloneDeep } from "lodash";
//import { Link, animateScroll as scroll } from "react-scroll";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const { onLogout } = useAuth();
  const user = useSelector(selectUser);
  const handleLogout = () => {
    onLogout();
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            <Link
              href={"/"}
              _hover={{
                textDecoration: "none",
              }}
              className="flex flex-col content-center text-center justify-items-center"
            >
              <p className="text-xl text-blue-900 border-b-2 border-green-600">
                easton
              </p>
              <p className="text-xs">FINANCIAL</p>
            </Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          alignItems="center"
          spacing={6}
        >
          {/*
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'wip'}>
            Sign In
          </Button>
	  */}
          <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"green.400"}
            href={"application"}
            _hover={{
              bg: "green.300",
            }}
          >
            Get Started
          </Button>
          {!user ? (
            <Link
              p={2}
              href={"/login"}
              fontSize={"sm"}
              fontWeight={500}
              //color={() => { useColorModeValue('gray.600', 'gray.200') }}
              _hover={{
                textDecoration: "none",
                //color: useColorModeValue('gray.800', 'white'),
              }}
              className="hover:text-green-500"
            >
              Login
            </Link>
          ) : (
            <Stack direction="row" alignItems="center">
              <Menu>
                <MenuButton bg="white">
                  <Avatar name={user.name} size="sm" />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const auth = useSelector((state) => state.auth);
  let customItems = cloneDeep(NAV_ITEMS);
  if (auth.user && auth.user.role === "dealer") {
    customItems.push({
      label: "Details for Dealer",
      href: "/dealer-details",
    });
  }
  if (auth.user && auth.user.role === "easton") {
    customItems.push({
      label: "Easton LOS",
      href: "/easton-details",
    });
  }
  return (
    <Stack direction={"row"} spacing={4} className="mt-3">
      {customItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                //color={() => { useColorModeValue('gray.600', 'gray.200') }}
                _hover={{
                  textDecoration: "none",
                  //color: useColorModeValue('gray.800', 'white'),
                }}
                className="hover:text-green-500"
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                //bg={useColorModeValue('white', 'gray.800')}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  const auth = useSelector((state) => state.auth);
  let customItems = cloneDeep(NAV_ITEMS);
  if (auth.user && auth.user.role === "dealer") {
    customItems.push({
      label: "Details for Dealer",
      href: "/dealer-details",
    });
  } else {
    customItems.push({
      label: "Details for Easton user",
      href: "/easton-details",
    });
  }
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {customItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/home",
  },
  //{
  //  label: 'Dashboard',
  //  href: 'demo_signin',
  //},
  //{
  //  label: 'Refinance',
  //  href: 'wip',
  //},
  //{
  //  label: 'Account',
  //  children: [
  //    {
  //      label: 'Customers',
  //      subLabel: 'See your account info',
  //      href: 'wip',
  //    },
  //    {
  //      label: 'Dealers',
  //      subLabel: 'Help us help others',
  //      href: 'wip',
  //    },
  //  ],
  //},
  {
    label: "Resources",
    children: [
      {
        label: "FAQ",
        subLabel: "Answers to frequently asked questions",
        href: "FAQ",
      },
      {
        label: "Privacy",
        subLabel: "Check out our privacy policy",
        href: "privacy",
      },
      {
        label: "Credit Application",
        subLabel: "Download a fillable PDF",
        href: "creditApplication",
      },
      {
        label: "Autopay Form",
        subLabel: "Start or Update autopay",
        href: "achForm",
      },
      {
        label: "Account Portal",
        subLabel: "Customer login to see account details",
        href: "https://easton.accountportalonline.com/",
      },
    ],
  },
  {
    label: "Upload Documents",
    href: "documentupload",
  },
  {
    label: "Online Application",
    href: "application",
  },
  {
    label: "Contact",
    href: "contact",
  },
];
