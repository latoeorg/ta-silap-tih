
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'AppSettings': typeof import("../components/AppSettings.vue")['default']
    'DarkToggle': typeof import("../components/DarkToggle.vue")['default']
    'PasswordInput': typeof import("../components/PasswordInput.vue")['default']
    'Search': typeof import("../components/Search.vue")['default']
    'ThemeCustomize': typeof import("../components/ThemeCustomize.vue")['default']
    'AuthForgotPassword': typeof import("../components/auth/ForgotPassword.vue")['default']
    'AuthSignIn': typeof import("../components/auth/SignIn.vue")['default']
    'AuthSignUp': typeof import("../components/auth/SignUp.vue")['default']
    'BaseBreadcrumbCustom': typeof import("../components/base/BreadcrumbCustom.vue")['default']
    'BaseDateRangePicker': typeof import("../components/base/DateRangePicker.vue")['default']
    'BaseKbd': typeof import("../components/base/Kbd.vue")['default']
    'DashboardOverview': typeof import("../components/dashboard/Overview.vue")['default']
    'LayoutAppSidebar': typeof import("../components/layout/AppSidebar.vue")['default']
    'LayoutAuth': typeof import("../components/layout/Auth.vue")['default']
    'LayoutHeader': typeof import("../components/layout/Header.vue")['default']
    'LayoutSidebarNavFooter': typeof import("../components/layout/SidebarNavFooter.vue")['default']
    'LayoutSidebarNavGroup': typeof import("../components/layout/SidebarNavGroup.vue")['default']
    'LayoutSidebarNavHeader': typeof import("../components/layout/SidebarNavHeader.vue")['default']
    'LayoutSidebarNavLink': typeof import("../components/layout/SidebarNavLink.vue")['default']
    'MailAccountSwitcher': typeof import("../components/mail/AccountSwitcher.vue")['default']
    'MailDisplay': typeof import("../components/mail/Display.vue")['default']
    'MailLayout': typeof import("../components/mail/Layout.vue")['default']
    'MailList': typeof import("../components/mail/List.vue")['default']
    'MailNav': typeof import("../components/mail/Nav.vue")['default']
    'MailDataMails': typeof import("../components/mail/data/mails")['default']
    'NavigationMenuDemoItem': typeof import("../components/navigation-menu/DemoItem.vue")['default']
    'SettingsAccountForm': typeof import("../components/settings/AccountForm.vue")['default']
    'SettingsAppearanceForm': typeof import("../components/settings/AppearanceForm.vue")['default']
    'SettingsDisplayForm': typeof import("../components/settings/DisplayForm.vue")['default']
    'SettingsLayout': typeof import("../components/settings/Layout.vue")['default']
    'SettingsNotificationsForm': typeof import("../components/settings/NotificationsForm.vue")['default']
    'SettingsProfileForm': typeof import("../components/settings/ProfileForm.vue")['default']
    'SettingsSidebarNav': typeof import("../components/settings/SidebarNav.vue")['default']
    'TasksComponentsDataTable': typeof import("../components/tasks/components/DataTable.vue")['default']
    'TasksComponentsDataTableColumnHeader': typeof import("../components/tasks/components/DataTableColumnHeader.vue")['default']
    'TasksComponentsDataTableFacetedFilter': typeof import("../components/tasks/components/DataTableFacetedFilter.vue")['default']
    'TasksComponentsDataTablePagination': typeof import("../components/tasks/components/DataTablePagination.vue")['default']
    'TasksComponentsDataTableRowActions': typeof import("../components/tasks/components/DataTableRowActions.vue")['default']
    'TasksComponentsDataTableToolbar': typeof import("../components/tasks/components/DataTableToolbar.vue")['default']
    'TasksComponentsDataTableViewOptions': typeof import("../components/tasks/components/DataTableViewOptions.vue")['default']
    'TasksComponentsColumns': typeof import("../components/tasks/components/columns")['default']
    'TasksData': typeof import("../components/tasks/data/data")['default']
    'TasksDataSchema': typeof import("../components/tasks/data/schema")['default']
    'UnoIcon': typeof import("../node_modules/.pnpm/@unocss+nuxt@66.1.3_magicast@0.3.5_postcss@8.5.4_vite@6.3.5_@types+node@22.15.29_jiti@2_0c8be3520acfeb98a7724820836efdab/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'Accordion': typeof import("../components/ui/accordion/index")['Accordion']
    'AccordionContent': typeof import("../components/ui/accordion/index")['AccordionContent']
    'AccordionItem': typeof import("../components/ui/accordion/index")['AccordionItem']
    'AccordionTrigger': typeof import("../components/ui/accordion/index")['AccordionTrigger']
    'Alert': typeof import("../components/ui/alert/index")['Alert']
    'AlertDescription': typeof import("../components/ui/alert/index")['AlertDescription']
    'AlertTitle': typeof import("../components/ui/alert/index")['AlertTitle']
    'AlertDialog': typeof import("../components/ui/alert-dialog/index")['AlertDialog']
    'AlertDialogAction': typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']
    'AlertDialogCancel': typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']
    'AlertDialogContent': typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']
    'AlertDialogDescription': typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']
    'AlertDialogFooter': typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']
    'AlertDialogHeader': typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']
    'AlertDialogTitle': typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']
    'AlertDialogTrigger': typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']
    'AspectRatio': typeof import("../components/ui/aspect-ratio/index")['AspectRatio']
    'Avatar': typeof import("../components/ui/avatar/index")['Avatar']
    'AvatarFallback': typeof import("../components/ui/avatar/index")['AvatarFallback']
    'AvatarImage': typeof import("../components/ui/avatar/index")['AvatarImage']
    'Badge': typeof import("../components/ui/badge/index")['Badge']
    'Breadcrumb': typeof import("../components/ui/breadcrumb/index")['Breadcrumb']
    'BreadcrumbEllipsis': typeof import("../components/ui/breadcrumb/index")['BreadcrumbEllipsis']
    'BreadcrumbItem': typeof import("../components/ui/breadcrumb/index")['BreadcrumbItem']
    'BreadcrumbLink': typeof import("../components/ui/breadcrumb/index")['BreadcrumbLink']
    'BreadcrumbList': typeof import("../components/ui/breadcrumb/index")['BreadcrumbList']
    'BreadcrumbPage': typeof import("../components/ui/breadcrumb/index")['BreadcrumbPage']
    'BreadcrumbSeparator': typeof import("../components/ui/breadcrumb/index")['BreadcrumbSeparator']
    'Button': typeof import("../components/ui/button/index")['Button']
    'Calendar': typeof import("../components/ui/calendar/index")['Calendar']
    'CalendarCell': typeof import("../components/ui/calendar/index")['CalendarCell']
    'CalendarCellTrigger': typeof import("../components/ui/calendar/index")['CalendarCellTrigger']
    'CalendarGrid': typeof import("../components/ui/calendar/index")['CalendarGrid']
    'CalendarGridBody': typeof import("../components/ui/calendar/index")['CalendarGridBody']
    'CalendarGridHead': typeof import("../components/ui/calendar/index")['CalendarGridHead']
    'CalendarGridRow': typeof import("../components/ui/calendar/index")['CalendarGridRow']
    'CalendarHeadCell': typeof import("../components/ui/calendar/index")['CalendarHeadCell']
    'CalendarHeader': typeof import("../components/ui/calendar/index")['CalendarHeader']
    'CalendarHeading': typeof import("../components/ui/calendar/index")['CalendarHeading']
    'CalendarNextButton': typeof import("../components/ui/calendar/index")['CalendarNextButton']
    'CalendarPrevButton': typeof import("../components/ui/calendar/index")['CalendarPrevButton']
    'Card': typeof import("../components/ui/card/index")['Card']
    'CardContent': typeof import("../components/ui/card/index")['CardContent']
    'CardDescription': typeof import("../components/ui/card/index")['CardDescription']
    'CardFooter': typeof import("../components/ui/card/index")['CardFooter']
    'CardHeader': typeof import("../components/ui/card/index")['CardHeader']
    'CardTitle': typeof import("../components/ui/card/index")['CardTitle']
    'Carousel': typeof import("../components/ui/carousel/index")['Carousel']
    'CarouselContent': typeof import("../components/ui/carousel/index")['CarouselContent']
    'CarouselItem': typeof import("../components/ui/carousel/index")['CarouselItem']
    'CarouselNext': typeof import("../components/ui/carousel/index")['CarouselNext']
    'CarouselPrevious': typeof import("../components/ui/carousel/index")['CarouselPrevious']
    'CarouselApi': typeof import("../components/ui/carousel/index")['CarouselApi']
    'ChartCrosshair': typeof import("../components/ui/chart/index")['ChartCrosshair']
    'ChartLegend': typeof import("../components/ui/chart/index")['ChartLegend']
    'ChartSingleTooltip': typeof import("../components/ui/chart/index")['ChartSingleTooltip']
    'ChartTooltip': typeof import("../components/ui/chart/index")['ChartTooltip']
    'AreaChart': typeof import("../components/ui/chart-area/index")['AreaChart']
    'BarChart': typeof import("../components/ui/chart-bar/index")['BarChart']
    'DonutChart': typeof import("../components/ui/chart-donut/index")['DonutChart']
    'LineChart': typeof import("../components/ui/chart-line/index")['LineChart']
    'Checkbox': typeof import("../components/ui/checkbox/index")['Checkbox']
    'Collapsible': typeof import("../components/ui/collapsible/index")['Collapsible']
    'CollapsibleContent': typeof import("../components/ui/collapsible/index")['CollapsibleContent']
    'CollapsibleTrigger': typeof import("../components/ui/collapsible/index")['CollapsibleTrigger']
    'Command': typeof import("../components/ui/command/index")['Command']
    'CommandDialog': typeof import("../components/ui/command/index")['CommandDialog']
    'CommandEmpty': typeof import("../components/ui/command/index")['CommandEmpty']
    'CommandGroup': typeof import("../components/ui/command/index")['CommandGroup']
    'CommandInput': typeof import("../components/ui/command/index")['CommandInput']
    'CommandItem': typeof import("../components/ui/command/index")['CommandItem']
    'CommandList': typeof import("../components/ui/command/index")['CommandList']
    'CommandSeparator': typeof import("../components/ui/command/index")['CommandSeparator']
    'CommandShortcut': typeof import("../components/ui/command/index")['CommandShortcut']
    'ContextMenu': typeof import("../components/ui/context-menu/index")['ContextMenu']
    'ContextMenuCheckboxItem': typeof import("../components/ui/context-menu/index")['ContextMenuCheckboxItem']
    'ContextMenuContent': typeof import("../components/ui/context-menu/index")['ContextMenuContent']
    'ContextMenuGroup': typeof import("../components/ui/context-menu/index")['ContextMenuGroup']
    'ContextMenuItem': typeof import("../components/ui/context-menu/index")['ContextMenuItem']
    'ContextMenuLabel': typeof import("../components/ui/context-menu/index")['ContextMenuLabel']
    'ContextMenuRadioGroup': typeof import("../components/ui/context-menu/index")['ContextMenuRadioGroup']
    'ContextMenuRadioItem': typeof import("../components/ui/context-menu/index")['ContextMenuRadioItem']
    'ContextMenuSeparator': typeof import("../components/ui/context-menu/index")['ContextMenuSeparator']
    'ContextMenuShortcut': typeof import("../components/ui/context-menu/index")['ContextMenuShortcut']
    'ContextMenuSub': typeof import("../components/ui/context-menu/index")['ContextMenuSub']
    'ContextMenuSubContent': typeof import("../components/ui/context-menu/index")['ContextMenuSubContent']
    'ContextMenuSubTrigger': typeof import("../components/ui/context-menu/index")['ContextMenuSubTrigger']
    'ContextMenuTrigger': typeof import("../components/ui/context-menu/index")['ContextMenuTrigger']
    'Dialog': typeof import("../components/ui/dialog/index")['Dialog']
    'DialogClose': typeof import("../components/ui/dialog/index")['DialogClose']
    'DialogContent': typeof import("../components/ui/dialog/index")['DialogContent']
    'DialogDescription': typeof import("../components/ui/dialog/index")['DialogDescription']
    'DialogFooter': typeof import("../components/ui/dialog/index")['DialogFooter']
    'DialogHeader': typeof import("../components/ui/dialog/index")['DialogHeader']
    'DialogScrollContent': typeof import("../components/ui/dialog/index")['DialogScrollContent']
    'DialogTitle': typeof import("../components/ui/dialog/index")['DialogTitle']
    'DialogTrigger': typeof import("../components/ui/dialog/index")['DialogTrigger']
    'Drawer': typeof import("../components/ui/drawer/index")['Drawer']
    'DrawerContent': typeof import("../components/ui/drawer/index")['DrawerContent']
    'DrawerDescription': typeof import("../components/ui/drawer/index")['DrawerDescription']
    'DrawerFooter': typeof import("../components/ui/drawer/index")['DrawerFooter']
    'DrawerHeader': typeof import("../components/ui/drawer/index")['DrawerHeader']
    'DrawerOverlay': typeof import("../components/ui/drawer/index")['DrawerOverlay']
    'DrawerTitle': typeof import("../components/ui/drawer/index")['DrawerTitle']
    'DrawerClose': typeof import("../components/ui/drawer/index")['DrawerClose']
    'DrawerPortal': typeof import("../components/ui/drawer/index")['DrawerPortal']
    'DrawerTrigger': typeof import("../components/ui/drawer/index")['DrawerTrigger']
    'DropdownMenu': typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
    'DropdownMenuCheckboxItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
    'DropdownMenuContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
    'DropdownMenuGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
    'DropdownMenuItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
    'DropdownMenuLabel': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
    'DropdownMenuRadioGroup': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
    'DropdownMenuRadioItem': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
    'DropdownMenuSeparator': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
    'DropdownMenuShortcut': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
    'DropdownMenuSub': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
    'DropdownMenuSubContent': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
    'DropdownMenuSubTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
    'DropdownMenuTrigger': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
    'DropdownMenuPortal': typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
    'FormControl': typeof import("../components/ui/form/index")['FormControl']
    'FormDescription': typeof import("../components/ui/form/index")['FormDescription']
    'FormItem': typeof import("../components/ui/form/index")['FormItem']
    'FormLabel': typeof import("../components/ui/form/index")['FormLabel']
    'FormMessage': typeof import("../components/ui/form/index")['FormMessage']
    'FORMITEMINJECTIONKEY': typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']
    'Form': typeof import("../components/ui/form/index")['Form']
    'FormField': typeof import("../components/ui/form/index")['FormField']
    'FormFieldArray': typeof import("../components/ui/form/index")['FormFieldArray']
    'HoverCard': typeof import("../components/ui/hover-card/index")['HoverCard']
    'HoverCardContent': typeof import("../components/ui/hover-card/index")['HoverCardContent']
    'HoverCardTrigger': typeof import("../components/ui/hover-card/index")['HoverCardTrigger']
    'Input': typeof import("../components/ui/input/index")['Input']
    'Label': typeof import("../components/ui/label/index")['Label']
    'Menubar': typeof import("../components/ui/menubar/index")['Menubar']
    'MenubarCheckboxItem': typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']
    'MenubarContent': typeof import("../components/ui/menubar/index")['MenubarContent']
    'MenubarGroup': typeof import("../components/ui/menubar/index")['MenubarGroup']
    'MenubarItem': typeof import("../components/ui/menubar/index")['MenubarItem']
    'MenubarLabel': typeof import("../components/ui/menubar/index")['MenubarLabel']
    'MenubarMenu': typeof import("../components/ui/menubar/index")['MenubarMenu']
    'MenubarRadioGroup': typeof import("../components/ui/menubar/index")['MenubarRadioGroup']
    'MenubarRadioItem': typeof import("../components/ui/menubar/index")['MenubarRadioItem']
    'MenubarSeparator': typeof import("../components/ui/menubar/index")['MenubarSeparator']
    'MenubarShortcut': typeof import("../components/ui/menubar/index")['MenubarShortcut']
    'MenubarSub': typeof import("../components/ui/menubar/index")['MenubarSub']
    'MenubarSubContent': typeof import("../components/ui/menubar/index")['MenubarSubContent']
    'MenubarSubTrigger': typeof import("../components/ui/menubar/index")['MenubarSubTrigger']
    'MenubarTrigger': typeof import("../components/ui/menubar/index")['MenubarTrigger']
    'NavigationMenu': typeof import("../components/ui/navigation-menu/index")['NavigationMenu']
    'NavigationMenuContent': typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']
    'NavigationMenuItem': typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']
    'NavigationMenuLink': typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']
    'NavigationMenuList': typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']
    'NavigationMenuTrigger': typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']
    'NumberField': typeof import("../components/ui/number-field/index")['NumberField']
    'NumberFieldContent': typeof import("../components/ui/number-field/index")['NumberFieldContent']
    'NumberFieldDecrement': typeof import("../components/ui/number-field/index")['NumberFieldDecrement']
    'NumberFieldIncrement': typeof import("../components/ui/number-field/index")['NumberFieldIncrement']
    'NumberFieldInput': typeof import("../components/ui/number-field/index")['NumberFieldInput']
    'PaginationEllipsis': typeof import("../components/ui/pagination/index")['PaginationEllipsis']
    'PaginationFirst': typeof import("../components/ui/pagination/index")['PaginationFirst']
    'PaginationLast': typeof import("../components/ui/pagination/index")['PaginationLast']
    'PaginationNext': typeof import("../components/ui/pagination/index")['PaginationNext']
    'PaginationPrev': typeof import("../components/ui/pagination/index")['PaginationPrev']
    'Pagination': typeof import("../components/ui/pagination/index")['Pagination']
    'PaginationList': typeof import("../components/ui/pagination/index")['PaginationList']
    'PaginationListItem': typeof import("../components/ui/pagination/index")['PaginationListItem']
    'PinInput': typeof import("../components/ui/pin-input/index")['PinInput']
    'PinInputGroup': typeof import("../components/ui/pin-input/index")['PinInputGroup']
    'PinInputInput': typeof import("../components/ui/pin-input/index")['PinInputInput']
    'PinInputSeparator': typeof import("../components/ui/pin-input/index")['PinInputSeparator']
    'Popover': typeof import("../components/ui/popover/index")['Popover']
    'PopoverContent': typeof import("../components/ui/popover/index")['PopoverContent']
    'PopoverTrigger': typeof import("../components/ui/popover/index")['PopoverTrigger']
    'Progress': typeof import("../components/ui/progress/index")['Progress']
    'RadioGroup': typeof import("../components/ui/radio-group/index")['RadioGroup']
    'RadioGroupItem': typeof import("../components/ui/radio-group/index")['RadioGroupItem']
    'RangeCalendar': typeof import("../components/ui/range-calendar/index")['RangeCalendar']
    'RangeCalendarCell': typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']
    'RangeCalendarCellTrigger': typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']
    'RangeCalendarGrid': typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']
    'RangeCalendarGridBody': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']
    'RangeCalendarGridHead': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']
    'RangeCalendarGridRow': typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']
    'RangeCalendarHeadCell': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']
    'RangeCalendarHeader': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']
    'RangeCalendarHeading': typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']
    'RangeCalendarNextButton': typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']
    'RangeCalendarPrevButton': typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']
    'ResizableHandle': typeof import("../components/ui/resizable/index")['ResizableHandle']
    'ResizablePanelGroup': typeof import("../components/ui/resizable/index")['ResizablePanelGroup']
    'ResizablePanel': typeof import("../components/ui/resizable/index")['ResizablePanel']
    'ScrollArea': typeof import("../components/ui/scroll-area/index")['ScrollArea']
    'ScrollBar': typeof import("../components/ui/scroll-area/index")['ScrollBar']
    'Select': typeof import("../components/ui/select/index")['Select']
    'SelectContent': typeof import("../components/ui/select/index")['SelectContent']
    'SelectGroup': typeof import("../components/ui/select/index")['SelectGroup']
    'SelectItem': typeof import("../components/ui/select/index")['SelectItem']
    'SelectItemText': typeof import("../components/ui/select/index")['SelectItemText']
    'SelectLabel': typeof import("../components/ui/select/index")['SelectLabel']
    'SelectScrollDownButton': typeof import("../components/ui/select/index")['SelectScrollDownButton']
    'SelectScrollUpButton': typeof import("../components/ui/select/index")['SelectScrollUpButton']
    'SelectSeparator': typeof import("../components/ui/select/index")['SelectSeparator']
    'SelectTrigger': typeof import("../components/ui/select/index")['SelectTrigger']
    'SelectValue': typeof import("../components/ui/select/index")['SelectValue']
    'Separator': typeof import("../components/ui/separator/index")['Separator']
    'Sheet': typeof import("../components/ui/sheet/index")['Sheet']
    'SheetClose': typeof import("../components/ui/sheet/index")['SheetClose']
    'SheetContent': typeof import("../components/ui/sheet/index")['SheetContent']
    'SheetDescription': typeof import("../components/ui/sheet/index")['SheetDescription']
    'SheetFooter': typeof import("../components/ui/sheet/index")['SheetFooter']
    'SheetHeader': typeof import("../components/ui/sheet/index")['SheetHeader']
    'SheetTitle': typeof import("../components/ui/sheet/index")['SheetTitle']
    'SheetTrigger': typeof import("../components/ui/sheet/index")['SheetTrigger']
    'Sidebar': typeof import("../components/ui/sidebar/index")['Sidebar']
    'SidebarContent': typeof import("../components/ui/sidebar/index")['SidebarContent']
    'SidebarFooter': typeof import("../components/ui/sidebar/index")['SidebarFooter']
    'SidebarGroup': typeof import("../components/ui/sidebar/index")['SidebarGroup']
    'SidebarGroupAction': typeof import("../components/ui/sidebar/index")['SidebarGroupAction']
    'SidebarGroupContent': typeof import("../components/ui/sidebar/index")['SidebarGroupContent']
    'SidebarGroupLabel': typeof import("../components/ui/sidebar/index")['SidebarGroupLabel']
    'SidebarHeader': typeof import("../components/ui/sidebar/index")['SidebarHeader']
    'SidebarInput': typeof import("../components/ui/sidebar/index")['SidebarInput']
    'SidebarInset': typeof import("../components/ui/sidebar/index")['SidebarInset']
    'SidebarMenu': typeof import("../components/ui/sidebar/index")['SidebarMenu']
    'SidebarMenuAction': typeof import("../components/ui/sidebar/index")['SidebarMenuAction']
    'SidebarMenuBadge': typeof import("../components/ui/sidebar/index")['SidebarMenuBadge']
    'SidebarMenuButton': typeof import("../components/ui/sidebar/index")['SidebarMenuButton']
    'SidebarMenuItem': typeof import("../components/ui/sidebar/index")['SidebarMenuItem']
    'SidebarMenuSkeleton': typeof import("../components/ui/sidebar/index")['SidebarMenuSkeleton']
    'SidebarMenuSub': typeof import("../components/ui/sidebar/index")['SidebarMenuSub']
    'SidebarMenuSubButton': typeof import("../components/ui/sidebar/index")['SidebarMenuSubButton']
    'SidebarMenuSubItem': typeof import("../components/ui/sidebar/index")['SidebarMenuSubItem']
    'SidebarProvider': typeof import("../components/ui/sidebar/index")['SidebarProvider']
    'SidebarRail': typeof import("../components/ui/sidebar/index")['SidebarRail']
    'SidebarSeparator': typeof import("../components/ui/sidebar/index")['SidebarSeparator']
    'SidebarTrigger': typeof import("../components/ui/sidebar/index")['SidebarTrigger']
    'Skeleton': typeof import("../components/ui/skeleton/index")['Skeleton']
    'Slider': typeof import("../components/ui/slider/index")['Slider']
    'Sonner': typeof import("../components/ui/sonner/index")['Sonner']
    'Stepper': typeof import("../components/ui/stepper/index")['Stepper']
    'StepperDescription': typeof import("../components/ui/stepper/index")['StepperDescription']
    'StepperIndicator': typeof import("../components/ui/stepper/index")['StepperIndicator']
    'StepperItem': typeof import("../components/ui/stepper/index")['StepperItem']
    'StepperSeparator': typeof import("../components/ui/stepper/index")['StepperSeparator']
    'StepperTitle': typeof import("../components/ui/stepper/index")['StepperTitle']
    'StepperTrigger': typeof import("../components/ui/stepper/index")['StepperTrigger']
    'Switch': typeof import("../components/ui/switch/index")['Switch']
    'Table': typeof import("../components/ui/table/index")['Table']
    'TableBody': typeof import("../components/ui/table/index")['TableBody']
    'TableCaption': typeof import("../components/ui/table/index")['TableCaption']
    'TableCell': typeof import("../components/ui/table/index")['TableCell']
    'TableEmpty': typeof import("../components/ui/table/index")['TableEmpty']
    'TableHead': typeof import("../components/ui/table/index")['TableHead']
    'TableHeader': typeof import("../components/ui/table/index")['TableHeader']
    'TableRow': typeof import("../components/ui/table/index")['TableRow']
    'Tabs': typeof import("../components/ui/tabs/index")['Tabs']
    'TabsContent': typeof import("../components/ui/tabs/index")['TabsContent']
    'TabsList': typeof import("../components/ui/tabs/index")['TabsList']
    'TabsTrigger': typeof import("../components/ui/tabs/index")['TabsTrigger']
    'TagsInput': typeof import("../components/ui/tags-input/index")['TagsInput']
    'TagsInputInput': typeof import("../components/ui/tags-input/index")['TagsInputInput']
    'TagsInputItem': typeof import("../components/ui/tags-input/index")['TagsInputItem']
    'TagsInputItemDelete': typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']
    'TagsInputItemText': typeof import("../components/ui/tags-input/index")['TagsInputItemText']
    'Textarea': typeof import("../components/ui/textarea/index")['Textarea']
    'Toast': typeof import("../components/ui/toast/index")['Toast']
    'ToastAction': typeof import("../components/ui/toast/index")['ToastAction']
    'ToastClose': typeof import("../components/ui/toast/index")['ToastClose']
    'ToastDescription': typeof import("../components/ui/toast/index")['ToastDescription']
    'Toaster': typeof import("../components/ui/toast/index")['Toaster']
    'ToastProvider': typeof import("../components/ui/toast/index")['ToastProvider']
    'ToastTitle': typeof import("../components/ui/toast/index")['ToastTitle']
    'ToastViewport': typeof import("../components/ui/toast/index")['ToastViewport']
    'Toggle': typeof import("../components/ui/toggle/index")['Toggle']
    'ToggleGroup': typeof import("../components/ui/toggle-group/index")['ToggleGroup']
    'ToggleGroupItem': typeof import("../components/ui/toggle-group/index")['ToggleGroupItem']
    'Tooltip': typeof import("../components/ui/tooltip/index")['Tooltip']
    'TooltipContent': typeof import("../components/ui/tooltip/index")['TooltipContent']
    'TooltipProvider': typeof import("../components/ui/tooltip/index")['TooltipProvider']
    'TooltipTrigger': typeof import("../components/ui/tooltip/index")['TooltipTrigger']
    'Icon': typeof import("../node_modules/.pnpm/@nuxt+icon@1.13.0_magicast@0.3.5_vite@6.3.5_@types+node@22.15.29_jiti@2.4.2_terser@5.40_07a12c5a204f64f5a9aa197bdc64e3c5/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
    'ColorScheme': typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyAppSettings': LazyComponent<typeof import("../components/AppSettings.vue")['default']>
    'LazyDarkToggle': LazyComponent<typeof import("../components/DarkToggle.vue")['default']>
    'LazyPasswordInput': LazyComponent<typeof import("../components/PasswordInput.vue")['default']>
    'LazySearch': LazyComponent<typeof import("../components/Search.vue")['default']>
    'LazyThemeCustomize': LazyComponent<typeof import("../components/ThemeCustomize.vue")['default']>
    'LazyAuthForgotPassword': LazyComponent<typeof import("../components/auth/ForgotPassword.vue")['default']>
    'LazyAuthSignIn': LazyComponent<typeof import("../components/auth/SignIn.vue")['default']>
    'LazyAuthSignUp': LazyComponent<typeof import("../components/auth/SignUp.vue")['default']>
    'LazyBaseBreadcrumbCustom': LazyComponent<typeof import("../components/base/BreadcrumbCustom.vue")['default']>
    'LazyBaseDateRangePicker': LazyComponent<typeof import("../components/base/DateRangePicker.vue")['default']>
    'LazyBaseKbd': LazyComponent<typeof import("../components/base/Kbd.vue")['default']>
    'LazyDashboardOverview': LazyComponent<typeof import("../components/dashboard/Overview.vue")['default']>
    'LazyLayoutAppSidebar': LazyComponent<typeof import("../components/layout/AppSidebar.vue")['default']>
    'LazyLayoutAuth': LazyComponent<typeof import("../components/layout/Auth.vue")['default']>
    'LazyLayoutHeader': LazyComponent<typeof import("../components/layout/Header.vue")['default']>
    'LazyLayoutSidebarNavFooter': LazyComponent<typeof import("../components/layout/SidebarNavFooter.vue")['default']>
    'LazyLayoutSidebarNavGroup': LazyComponent<typeof import("../components/layout/SidebarNavGroup.vue")['default']>
    'LazyLayoutSidebarNavHeader': LazyComponent<typeof import("../components/layout/SidebarNavHeader.vue")['default']>
    'LazyLayoutSidebarNavLink': LazyComponent<typeof import("../components/layout/SidebarNavLink.vue")['default']>
    'LazyMailAccountSwitcher': LazyComponent<typeof import("../components/mail/AccountSwitcher.vue")['default']>
    'LazyMailDisplay': LazyComponent<typeof import("../components/mail/Display.vue")['default']>
    'LazyMailLayout': LazyComponent<typeof import("../components/mail/Layout.vue")['default']>
    'LazyMailList': LazyComponent<typeof import("../components/mail/List.vue")['default']>
    'LazyMailNav': LazyComponent<typeof import("../components/mail/Nav.vue")['default']>
    'LazyMailDataMails': LazyComponent<typeof import("../components/mail/data/mails")['default']>
    'LazyNavigationMenuDemoItem': LazyComponent<typeof import("../components/navigation-menu/DemoItem.vue")['default']>
    'LazySettingsAccountForm': LazyComponent<typeof import("../components/settings/AccountForm.vue")['default']>
    'LazySettingsAppearanceForm': LazyComponent<typeof import("../components/settings/AppearanceForm.vue")['default']>
    'LazySettingsDisplayForm': LazyComponent<typeof import("../components/settings/DisplayForm.vue")['default']>
    'LazySettingsLayout': LazyComponent<typeof import("../components/settings/Layout.vue")['default']>
    'LazySettingsNotificationsForm': LazyComponent<typeof import("../components/settings/NotificationsForm.vue")['default']>
    'LazySettingsProfileForm': LazyComponent<typeof import("../components/settings/ProfileForm.vue")['default']>
    'LazySettingsSidebarNav': LazyComponent<typeof import("../components/settings/SidebarNav.vue")['default']>
    'LazyTasksComponentsDataTable': LazyComponent<typeof import("../components/tasks/components/DataTable.vue")['default']>
    'LazyTasksComponentsDataTableColumnHeader': LazyComponent<typeof import("../components/tasks/components/DataTableColumnHeader.vue")['default']>
    'LazyTasksComponentsDataTableFacetedFilter': LazyComponent<typeof import("../components/tasks/components/DataTableFacetedFilter.vue")['default']>
    'LazyTasksComponentsDataTablePagination': LazyComponent<typeof import("../components/tasks/components/DataTablePagination.vue")['default']>
    'LazyTasksComponentsDataTableRowActions': LazyComponent<typeof import("../components/tasks/components/DataTableRowActions.vue")['default']>
    'LazyTasksComponentsDataTableToolbar': LazyComponent<typeof import("../components/tasks/components/DataTableToolbar.vue")['default']>
    'LazyTasksComponentsDataTableViewOptions': LazyComponent<typeof import("../components/tasks/components/DataTableViewOptions.vue")['default']>
    'LazyTasksComponentsColumns': LazyComponent<typeof import("../components/tasks/components/columns")['default']>
    'LazyTasksData': LazyComponent<typeof import("../components/tasks/data/data")['default']>
    'LazyTasksDataSchema': LazyComponent<typeof import("../components/tasks/data/schema")['default']>
    'LazyUnoIcon': LazyComponent<typeof import("../node_modules/.pnpm/@unocss+nuxt@66.1.3_magicast@0.3.5_postcss@8.5.4_vite@6.3.5_@types+node@22.15.29_jiti@2_0c8be3520acfeb98a7724820836efdab/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyAccordion': LazyComponent<typeof import("../components/ui/accordion/index")['Accordion']>
    'LazyAccordionContent': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionContent']>
    'LazyAccordionItem': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionItem']>
    'LazyAccordionTrigger': LazyComponent<typeof import("../components/ui/accordion/index")['AccordionTrigger']>
    'LazyAlert': LazyComponent<typeof import("../components/ui/alert/index")['Alert']>
    'LazyAlertDescription': LazyComponent<typeof import("../components/ui/alert/index")['AlertDescription']>
    'LazyAlertTitle': LazyComponent<typeof import("../components/ui/alert/index")['AlertTitle']>
    'LazyAlertDialog': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialog']>
    'LazyAlertDialogAction': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']>
    'LazyAlertDialogCancel': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']>
    'LazyAlertDialogContent': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']>
    'LazyAlertDialogDescription': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']>
    'LazyAlertDialogFooter': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']>
    'LazyAlertDialogHeader': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']>
    'LazyAlertDialogTitle': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']>
    'LazyAlertDialogTrigger': LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']>
    'LazyAspectRatio': LazyComponent<typeof import("../components/ui/aspect-ratio/index")['AspectRatio']>
    'LazyAvatar': LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
    'LazyAvatarFallback': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
    'LazyAvatarImage': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
    'LazyBadge': LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
    'LazyBreadcrumb': LazyComponent<typeof import("../components/ui/breadcrumb/index")['Breadcrumb']>
    'LazyBreadcrumbEllipsis': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbEllipsis']>
    'LazyBreadcrumbItem': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbItem']>
    'LazyBreadcrumbLink': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbLink']>
    'LazyBreadcrumbList': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbList']>
    'LazyBreadcrumbPage': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbPage']>
    'LazyBreadcrumbSeparator': LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbSeparator']>
    'LazyButton': LazyComponent<typeof import("../components/ui/button/index")['Button']>
    'LazyCalendar': LazyComponent<typeof import("../components/ui/calendar/index")['Calendar']>
    'LazyCalendarCell': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCell']>
    'LazyCalendarCellTrigger': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCellTrigger']>
    'LazyCalendarGrid': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGrid']>
    'LazyCalendarGridBody': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridBody']>
    'LazyCalendarGridHead': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridHead']>
    'LazyCalendarGridRow': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridRow']>
    'LazyCalendarHeadCell': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeadCell']>
    'LazyCalendarHeader': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeader']>
    'LazyCalendarHeading': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeading']>
    'LazyCalendarNextButton': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarNextButton']>
    'LazyCalendarPrevButton': LazyComponent<typeof import("../components/ui/calendar/index")['CalendarPrevButton']>
    'LazyCard': LazyComponent<typeof import("../components/ui/card/index")['Card']>
    'LazyCardContent': LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
    'LazyCardDescription': LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
    'LazyCardFooter': LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
    'LazyCardHeader': LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
    'LazyCardTitle': LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
    'LazyCarousel': LazyComponent<typeof import("../components/ui/carousel/index")['Carousel']>
    'LazyCarouselContent': LazyComponent<typeof import("../components/ui/carousel/index")['CarouselContent']>
    'LazyCarouselItem': LazyComponent<typeof import("../components/ui/carousel/index")['CarouselItem']>
    'LazyCarouselNext': LazyComponent<typeof import("../components/ui/carousel/index")['CarouselNext']>
    'LazyCarouselPrevious': LazyComponent<typeof import("../components/ui/carousel/index")['CarouselPrevious']>
    'LazyCarouselApi': LazyComponent<typeof import("../components/ui/carousel/index")['CarouselApi']>
    'LazyChartCrosshair': LazyComponent<typeof import("../components/ui/chart/index")['ChartCrosshair']>
    'LazyChartLegend': LazyComponent<typeof import("../components/ui/chart/index")['ChartLegend']>
    'LazyChartSingleTooltip': LazyComponent<typeof import("../components/ui/chart/index")['ChartSingleTooltip']>
    'LazyChartTooltip': LazyComponent<typeof import("../components/ui/chart/index")['ChartTooltip']>
    'LazyAreaChart': LazyComponent<typeof import("../components/ui/chart-area/index")['AreaChart']>
    'LazyBarChart': LazyComponent<typeof import("../components/ui/chart-bar/index")['BarChart']>
    'LazyDonutChart': LazyComponent<typeof import("../components/ui/chart-donut/index")['DonutChart']>
    'LazyLineChart': LazyComponent<typeof import("../components/ui/chart-line/index")['LineChart']>
    'LazyCheckbox': LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
    'LazyCollapsible': LazyComponent<typeof import("../components/ui/collapsible/index")['Collapsible']>
    'LazyCollapsibleContent': LazyComponent<typeof import("../components/ui/collapsible/index")['CollapsibleContent']>
    'LazyCollapsibleTrigger': LazyComponent<typeof import("../components/ui/collapsible/index")['CollapsibleTrigger']>
    'LazyCommand': LazyComponent<typeof import("../components/ui/command/index")['Command']>
    'LazyCommandDialog': LazyComponent<typeof import("../components/ui/command/index")['CommandDialog']>
    'LazyCommandEmpty': LazyComponent<typeof import("../components/ui/command/index")['CommandEmpty']>
    'LazyCommandGroup': LazyComponent<typeof import("../components/ui/command/index")['CommandGroup']>
    'LazyCommandInput': LazyComponent<typeof import("../components/ui/command/index")['CommandInput']>
    'LazyCommandItem': LazyComponent<typeof import("../components/ui/command/index")['CommandItem']>
    'LazyCommandList': LazyComponent<typeof import("../components/ui/command/index")['CommandList']>
    'LazyCommandSeparator': LazyComponent<typeof import("../components/ui/command/index")['CommandSeparator']>
    'LazyCommandShortcut': LazyComponent<typeof import("../components/ui/command/index")['CommandShortcut']>
    'LazyContextMenu': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenu']>
    'LazyContextMenuCheckboxItem': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuCheckboxItem']>
    'LazyContextMenuContent': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuContent']>
    'LazyContextMenuGroup': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuGroup']>
    'LazyContextMenuItem': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuItem']>
    'LazyContextMenuLabel': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuLabel']>
    'LazyContextMenuRadioGroup': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuRadioGroup']>
    'LazyContextMenuRadioItem': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuRadioItem']>
    'LazyContextMenuSeparator': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSeparator']>
    'LazyContextMenuShortcut': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuShortcut']>
    'LazyContextMenuSub': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSub']>
    'LazyContextMenuSubContent': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSubContent']>
    'LazyContextMenuSubTrigger': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSubTrigger']>
    'LazyContextMenuTrigger': LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuTrigger']>
    'LazyDialog': LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
    'LazyDialogClose': LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
    'LazyDialogContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
    'LazyDialogDescription': LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
    'LazyDialogFooter': LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
    'LazyDialogHeader': LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
    'LazyDialogScrollContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
    'LazyDialogTitle': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
    'LazyDialogTrigger': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
    'LazyDrawer': LazyComponent<typeof import("../components/ui/drawer/index")['Drawer']>
    'LazyDrawerContent': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerContent']>
    'LazyDrawerDescription': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerDescription']>
    'LazyDrawerFooter': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerFooter']>
    'LazyDrawerHeader': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerHeader']>
    'LazyDrawerOverlay': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerOverlay']>
    'LazyDrawerTitle': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerTitle']>
    'LazyDrawerClose': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerClose']>
    'LazyDrawerPortal': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerPortal']>
    'LazyDrawerTrigger': LazyComponent<typeof import("../components/ui/drawer/index")['DrawerTrigger']>
    'LazyDropdownMenu': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
    'LazyDropdownMenuCheckboxItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
    'LazyDropdownMenuContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
    'LazyDropdownMenuGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
    'LazyDropdownMenuItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
    'LazyDropdownMenuLabel': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
    'LazyDropdownMenuRadioGroup': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
    'LazyDropdownMenuRadioItem': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
    'LazyDropdownMenuSeparator': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
    'LazyDropdownMenuShortcut': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
    'LazyDropdownMenuSub': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
    'LazyDropdownMenuSubContent': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
    'LazyDropdownMenuSubTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
    'LazyDropdownMenuTrigger': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
    'LazyDropdownMenuPortal': LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
    'LazyFormControl': LazyComponent<typeof import("../components/ui/form/index")['FormControl']>
    'LazyFormDescription': LazyComponent<typeof import("../components/ui/form/index")['FormDescription']>
    'LazyFormItem': LazyComponent<typeof import("../components/ui/form/index")['FormItem']>
    'LazyFormLabel': LazyComponent<typeof import("../components/ui/form/index")['FormLabel']>
    'LazyFormMessage': LazyComponent<typeof import("../components/ui/form/index")['FormMessage']>
    'LazyFORMITEMINJECTIONKEY': LazyComponent<typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']>
    'LazyForm': LazyComponent<typeof import("../components/ui/form/index")['Form']>
    'LazyFormField': LazyComponent<typeof import("../components/ui/form/index")['FormField']>
    'LazyFormFieldArray': LazyComponent<typeof import("../components/ui/form/index")['FormFieldArray']>
    'LazyHoverCard': LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCard']>
    'LazyHoverCardContent': LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCardContent']>
    'LazyHoverCardTrigger': LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCardTrigger']>
    'LazyInput': LazyComponent<typeof import("../components/ui/input/index")['Input']>
    'LazyLabel': LazyComponent<typeof import("../components/ui/label/index")['Label']>
    'LazyMenubar': LazyComponent<typeof import("../components/ui/menubar/index")['Menubar']>
    'LazyMenubarCheckboxItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']>
    'LazyMenubarContent': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarContent']>
    'LazyMenubarGroup': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarGroup']>
    'LazyMenubarItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarItem']>
    'LazyMenubarLabel': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarLabel']>
    'LazyMenubarMenu': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarMenu']>
    'LazyMenubarRadioGroup': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioGroup']>
    'LazyMenubarRadioItem': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioItem']>
    'LazyMenubarSeparator': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSeparator']>
    'LazyMenubarShortcut': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarShortcut']>
    'LazyMenubarSub': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSub']>
    'LazyMenubarSubContent': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubContent']>
    'LazyMenubarSubTrigger': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubTrigger']>
    'LazyMenubarTrigger': LazyComponent<typeof import("../components/ui/menubar/index")['MenubarTrigger']>
    'LazyNavigationMenu': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenu']>
    'LazyNavigationMenuContent': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']>
    'LazyNavigationMenuItem': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']>
    'LazyNavigationMenuLink': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']>
    'LazyNavigationMenuList': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']>
    'LazyNavigationMenuTrigger': LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']>
    'LazyNumberField': LazyComponent<typeof import("../components/ui/number-field/index")['NumberField']>
    'LazyNumberFieldContent': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldContent']>
    'LazyNumberFieldDecrement': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldDecrement']>
    'LazyNumberFieldIncrement': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldIncrement']>
    'LazyNumberFieldInput': LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldInput']>
    'LazyPaginationEllipsis': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationEllipsis']>
    'LazyPaginationFirst': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationFirst']>
    'LazyPaginationLast': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationLast']>
    'LazyPaginationNext': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationNext']>
    'LazyPaginationPrev': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationPrev']>
    'LazyPagination': LazyComponent<typeof import("../components/ui/pagination/index")['Pagination']>
    'LazyPaginationList': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationList']>
    'LazyPaginationListItem': LazyComponent<typeof import("../components/ui/pagination/index")['PaginationListItem']>
    'LazyPinInput': LazyComponent<typeof import("../components/ui/pin-input/index")['PinInput']>
    'LazyPinInputGroup': LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputGroup']>
    'LazyPinInputInput': LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputInput']>
    'LazyPinInputSeparator': LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputSeparator']>
    'LazyPopover': LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
    'LazyPopoverContent': LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
    'LazyPopoverTrigger': LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
    'LazyProgress': LazyComponent<typeof import("../components/ui/progress/index")['Progress']>
    'LazyRadioGroup': LazyComponent<typeof import("../components/ui/radio-group/index")['RadioGroup']>
    'LazyRadioGroupItem': LazyComponent<typeof import("../components/ui/radio-group/index")['RadioGroupItem']>
    'LazyRangeCalendar': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendar']>
    'LazyRangeCalendarCell': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']>
    'LazyRangeCalendarCellTrigger': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']>
    'LazyRangeCalendarGrid': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']>
    'LazyRangeCalendarGridBody': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']>
    'LazyRangeCalendarGridHead': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']>
    'LazyRangeCalendarGridRow': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']>
    'LazyRangeCalendarHeadCell': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']>
    'LazyRangeCalendarHeader': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']>
    'LazyRangeCalendarHeading': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']>
    'LazyRangeCalendarNextButton': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']>
    'LazyRangeCalendarPrevButton': LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']>
    'LazyResizableHandle': LazyComponent<typeof import("../components/ui/resizable/index")['ResizableHandle']>
    'LazyResizablePanelGroup': LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanelGroup']>
    'LazyResizablePanel': LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanel']>
    'LazyScrollArea': LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollArea']>
    'LazyScrollBar': LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollBar']>
    'LazySelect': LazyComponent<typeof import("../components/ui/select/index")['Select']>
    'LazySelectContent': LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
    'LazySelectGroup': LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
    'LazySelectItem': LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
    'LazySelectItemText': LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
    'LazySelectLabel': LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
    'LazySelectScrollDownButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
    'LazySelectScrollUpButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
    'LazySelectSeparator': LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
    'LazySelectTrigger': LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
    'LazySelectValue': LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
    'LazySeparator': LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
    'LazySheet': LazyComponent<typeof import("../components/ui/sheet/index")['Sheet']>
    'LazySheetClose': LazyComponent<typeof import("../components/ui/sheet/index")['SheetClose']>
    'LazySheetContent': LazyComponent<typeof import("../components/ui/sheet/index")['SheetContent']>
    'LazySheetDescription': LazyComponent<typeof import("../components/ui/sheet/index")['SheetDescription']>
    'LazySheetFooter': LazyComponent<typeof import("../components/ui/sheet/index")['SheetFooter']>
    'LazySheetHeader': LazyComponent<typeof import("../components/ui/sheet/index")['SheetHeader']>
    'LazySheetTitle': LazyComponent<typeof import("../components/ui/sheet/index")['SheetTitle']>
    'LazySheetTrigger': LazyComponent<typeof import("../components/ui/sheet/index")['SheetTrigger']>
    'LazySidebar': LazyComponent<typeof import("../components/ui/sidebar/index")['Sidebar']>
    'LazySidebarContent': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarContent']>
    'LazySidebarFooter': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarFooter']>
    'LazySidebarGroup': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroup']>
    'LazySidebarGroupAction': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupAction']>
    'LazySidebarGroupContent': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupContent']>
    'LazySidebarGroupLabel': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupLabel']>
    'LazySidebarHeader': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarHeader']>
    'LazySidebarInput': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarInput']>
    'LazySidebarInset': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarInset']>
    'LazySidebarMenu': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenu']>
    'LazySidebarMenuAction': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuAction']>
    'LazySidebarMenuBadge': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuBadge']>
    'LazySidebarMenuButton': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuButton']>
    'LazySidebarMenuItem': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuItem']>
    'LazySidebarMenuSkeleton': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSkeleton']>
    'LazySidebarMenuSub': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSub']>
    'LazySidebarMenuSubButton': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSubButton']>
    'LazySidebarMenuSubItem': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSubItem']>
    'LazySidebarProvider': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarProvider']>
    'LazySidebarRail': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarRail']>
    'LazySidebarSeparator': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarSeparator']>
    'LazySidebarTrigger': LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarTrigger']>
    'LazySkeleton': LazyComponent<typeof import("../components/ui/skeleton/index")['Skeleton']>
    'LazySlider': LazyComponent<typeof import("../components/ui/slider/index")['Slider']>
    'LazySonner': LazyComponent<typeof import("../components/ui/sonner/index")['Sonner']>
    'LazyStepper': LazyComponent<typeof import("../components/ui/stepper/index")['Stepper']>
    'LazyStepperDescription': LazyComponent<typeof import("../components/ui/stepper/index")['StepperDescription']>
    'LazyStepperIndicator': LazyComponent<typeof import("../components/ui/stepper/index")['StepperIndicator']>
    'LazyStepperItem': LazyComponent<typeof import("../components/ui/stepper/index")['StepperItem']>
    'LazyStepperSeparator': LazyComponent<typeof import("../components/ui/stepper/index")['StepperSeparator']>
    'LazyStepperTitle': LazyComponent<typeof import("../components/ui/stepper/index")['StepperTitle']>
    'LazyStepperTrigger': LazyComponent<typeof import("../components/ui/stepper/index")['StepperTrigger']>
    'LazySwitch': LazyComponent<typeof import("../components/ui/switch/index")['Switch']>
    'LazyTable': LazyComponent<typeof import("../components/ui/table/index")['Table']>
    'LazyTableBody': LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
    'LazyTableCaption': LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
    'LazyTableCell': LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
    'LazyTableEmpty': LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
    'LazyTableHead': LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
    'LazyTableHeader': LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
    'LazyTableRow': LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
    'LazyTabs': LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
    'LazyTabsContent': LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
    'LazyTabsList': LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
    'LazyTabsTrigger': LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
    'LazyTagsInput': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInput']>
    'LazyTagsInputInput': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputInput']>
    'LazyTagsInputItem': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItem']>
    'LazyTagsInputItemDelete': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']>
    'LazyTagsInputItemText': LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemText']>
    'LazyTextarea': LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
    'LazyToast': LazyComponent<typeof import("../components/ui/toast/index")['Toast']>
    'LazyToastAction': LazyComponent<typeof import("../components/ui/toast/index")['ToastAction']>
    'LazyToastClose': LazyComponent<typeof import("../components/ui/toast/index")['ToastClose']>
    'LazyToastDescription': LazyComponent<typeof import("../components/ui/toast/index")['ToastDescription']>
    'LazyToaster': LazyComponent<typeof import("../components/ui/toast/index")['Toaster']>
    'LazyToastProvider': LazyComponent<typeof import("../components/ui/toast/index")['ToastProvider']>
    'LazyToastTitle': LazyComponent<typeof import("../components/ui/toast/index")['ToastTitle']>
    'LazyToastViewport': LazyComponent<typeof import("../components/ui/toast/index")['ToastViewport']>
    'LazyToggle': LazyComponent<typeof import("../components/ui/toggle/index")['Toggle']>
    'LazyToggleGroup': LazyComponent<typeof import("../components/ui/toggle-group/index")['ToggleGroup']>
    'LazyToggleGroupItem': LazyComponent<typeof import("../components/ui/toggle-group/index")['ToggleGroupItem']>
    'LazyTooltip': LazyComponent<typeof import("../components/ui/tooltip/index")['Tooltip']>
    'LazyTooltipContent': LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipContent']>
    'LazyTooltipProvider': LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipProvider']>
    'LazyTooltipTrigger': LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipTrigger']>
    'LazyIcon': LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+icon@1.13.0_magicast@0.3.5_vite@6.3.5_@types+node@22.15.29_jiti@2.4.2_terser@5.40_07a12c5a204f64f5a9aa197bdc64e3c5/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const AppSettings: typeof import("../components/AppSettings.vue")['default']
export const DarkToggle: typeof import("../components/DarkToggle.vue")['default']
export const PasswordInput: typeof import("../components/PasswordInput.vue")['default']
export const Search: typeof import("../components/Search.vue")['default']
export const ThemeCustomize: typeof import("../components/ThemeCustomize.vue")['default']
export const AuthForgotPassword: typeof import("../components/auth/ForgotPassword.vue")['default']
export const AuthSignIn: typeof import("../components/auth/SignIn.vue")['default']
export const AuthSignUp: typeof import("../components/auth/SignUp.vue")['default']
export const BaseBreadcrumbCustom: typeof import("../components/base/BreadcrumbCustom.vue")['default']
export const BaseDateRangePicker: typeof import("../components/base/DateRangePicker.vue")['default']
export const BaseKbd: typeof import("../components/base/Kbd.vue")['default']
export const DashboardOverview: typeof import("../components/dashboard/Overview.vue")['default']
export const LayoutAppSidebar: typeof import("../components/layout/AppSidebar.vue")['default']
export const LayoutAuth: typeof import("../components/layout/Auth.vue")['default']
export const LayoutHeader: typeof import("../components/layout/Header.vue")['default']
export const LayoutSidebarNavFooter: typeof import("../components/layout/SidebarNavFooter.vue")['default']
export const LayoutSidebarNavGroup: typeof import("../components/layout/SidebarNavGroup.vue")['default']
export const LayoutSidebarNavHeader: typeof import("../components/layout/SidebarNavHeader.vue")['default']
export const LayoutSidebarNavLink: typeof import("../components/layout/SidebarNavLink.vue")['default']
export const MailAccountSwitcher: typeof import("../components/mail/AccountSwitcher.vue")['default']
export const MailDisplay: typeof import("../components/mail/Display.vue")['default']
export const MailLayout: typeof import("../components/mail/Layout.vue")['default']
export const MailList: typeof import("../components/mail/List.vue")['default']
export const MailNav: typeof import("../components/mail/Nav.vue")['default']
export const MailDataMails: typeof import("../components/mail/data/mails")['default']
export const NavigationMenuDemoItem: typeof import("../components/navigation-menu/DemoItem.vue")['default']
export const SettingsAccountForm: typeof import("../components/settings/AccountForm.vue")['default']
export const SettingsAppearanceForm: typeof import("../components/settings/AppearanceForm.vue")['default']
export const SettingsDisplayForm: typeof import("../components/settings/DisplayForm.vue")['default']
export const SettingsLayout: typeof import("../components/settings/Layout.vue")['default']
export const SettingsNotificationsForm: typeof import("../components/settings/NotificationsForm.vue")['default']
export const SettingsProfileForm: typeof import("../components/settings/ProfileForm.vue")['default']
export const SettingsSidebarNav: typeof import("../components/settings/SidebarNav.vue")['default']
export const TasksComponentsDataTable: typeof import("../components/tasks/components/DataTable.vue")['default']
export const TasksComponentsDataTableColumnHeader: typeof import("../components/tasks/components/DataTableColumnHeader.vue")['default']
export const TasksComponentsDataTableFacetedFilter: typeof import("../components/tasks/components/DataTableFacetedFilter.vue")['default']
export const TasksComponentsDataTablePagination: typeof import("../components/tasks/components/DataTablePagination.vue")['default']
export const TasksComponentsDataTableRowActions: typeof import("../components/tasks/components/DataTableRowActions.vue")['default']
export const TasksComponentsDataTableToolbar: typeof import("../components/tasks/components/DataTableToolbar.vue")['default']
export const TasksComponentsDataTableViewOptions: typeof import("../components/tasks/components/DataTableViewOptions.vue")['default']
export const TasksComponentsColumns: typeof import("../components/tasks/components/columns")['default']
export const TasksData: typeof import("../components/tasks/data/data")['default']
export const TasksDataSchema: typeof import("../components/tasks/data/schema")['default']
export const UnoIcon: typeof import("../node_modules/.pnpm/@unocss+nuxt@66.1.3_magicast@0.3.5_postcss@8.5.4_vite@6.3.5_@types+node@22.15.29_jiti@2_0c8be3520acfeb98a7724820836efdab/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const Accordion: typeof import("../components/ui/accordion/index")['Accordion']
export const AccordionContent: typeof import("../components/ui/accordion/index")['AccordionContent']
export const AccordionItem: typeof import("../components/ui/accordion/index")['AccordionItem']
export const AccordionTrigger: typeof import("../components/ui/accordion/index")['AccordionTrigger']
export const Alert: typeof import("../components/ui/alert/index")['Alert']
export const AlertDescription: typeof import("../components/ui/alert/index")['AlertDescription']
export const AlertTitle: typeof import("../components/ui/alert/index")['AlertTitle']
export const AlertDialog: typeof import("../components/ui/alert-dialog/index")['AlertDialog']
export const AlertDialogAction: typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']
export const AlertDialogCancel: typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']
export const AlertDialogContent: typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']
export const AlertDialogDescription: typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']
export const AlertDialogFooter: typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']
export const AlertDialogHeader: typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']
export const AlertDialogTitle: typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']
export const AlertDialogTrigger: typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']
export const AspectRatio: typeof import("../components/ui/aspect-ratio/index")['AspectRatio']
export const Avatar: typeof import("../components/ui/avatar/index")['Avatar']
export const AvatarFallback: typeof import("../components/ui/avatar/index")['AvatarFallback']
export const AvatarImage: typeof import("../components/ui/avatar/index")['AvatarImage']
export const Badge: typeof import("../components/ui/badge/index")['Badge']
export const Breadcrumb: typeof import("../components/ui/breadcrumb/index")['Breadcrumb']
export const BreadcrumbEllipsis: typeof import("../components/ui/breadcrumb/index")['BreadcrumbEllipsis']
export const BreadcrumbItem: typeof import("../components/ui/breadcrumb/index")['BreadcrumbItem']
export const BreadcrumbLink: typeof import("../components/ui/breadcrumb/index")['BreadcrumbLink']
export const BreadcrumbList: typeof import("../components/ui/breadcrumb/index")['BreadcrumbList']
export const BreadcrumbPage: typeof import("../components/ui/breadcrumb/index")['BreadcrumbPage']
export const BreadcrumbSeparator: typeof import("../components/ui/breadcrumb/index")['BreadcrumbSeparator']
export const Button: typeof import("../components/ui/button/index")['Button']
export const Calendar: typeof import("../components/ui/calendar/index")['Calendar']
export const CalendarCell: typeof import("../components/ui/calendar/index")['CalendarCell']
export const CalendarCellTrigger: typeof import("../components/ui/calendar/index")['CalendarCellTrigger']
export const CalendarGrid: typeof import("../components/ui/calendar/index")['CalendarGrid']
export const CalendarGridBody: typeof import("../components/ui/calendar/index")['CalendarGridBody']
export const CalendarGridHead: typeof import("../components/ui/calendar/index")['CalendarGridHead']
export const CalendarGridRow: typeof import("../components/ui/calendar/index")['CalendarGridRow']
export const CalendarHeadCell: typeof import("../components/ui/calendar/index")['CalendarHeadCell']
export const CalendarHeader: typeof import("../components/ui/calendar/index")['CalendarHeader']
export const CalendarHeading: typeof import("../components/ui/calendar/index")['CalendarHeading']
export const CalendarNextButton: typeof import("../components/ui/calendar/index")['CalendarNextButton']
export const CalendarPrevButton: typeof import("../components/ui/calendar/index")['CalendarPrevButton']
export const Card: typeof import("../components/ui/card/index")['Card']
export const CardContent: typeof import("../components/ui/card/index")['CardContent']
export const CardDescription: typeof import("../components/ui/card/index")['CardDescription']
export const CardFooter: typeof import("../components/ui/card/index")['CardFooter']
export const CardHeader: typeof import("../components/ui/card/index")['CardHeader']
export const CardTitle: typeof import("../components/ui/card/index")['CardTitle']
export const Carousel: typeof import("../components/ui/carousel/index")['Carousel']
export const CarouselContent: typeof import("../components/ui/carousel/index")['CarouselContent']
export const CarouselItem: typeof import("../components/ui/carousel/index")['CarouselItem']
export const CarouselNext: typeof import("../components/ui/carousel/index")['CarouselNext']
export const CarouselPrevious: typeof import("../components/ui/carousel/index")['CarouselPrevious']
export const CarouselApi: typeof import("../components/ui/carousel/index")['CarouselApi']
export const ChartCrosshair: typeof import("../components/ui/chart/index")['ChartCrosshair']
export const ChartLegend: typeof import("../components/ui/chart/index")['ChartLegend']
export const ChartSingleTooltip: typeof import("../components/ui/chart/index")['ChartSingleTooltip']
export const ChartTooltip: typeof import("../components/ui/chart/index")['ChartTooltip']
export const AreaChart: typeof import("../components/ui/chart-area/index")['AreaChart']
export const BarChart: typeof import("../components/ui/chart-bar/index")['BarChart']
export const DonutChart: typeof import("../components/ui/chart-donut/index")['DonutChart']
export const LineChart: typeof import("../components/ui/chart-line/index")['LineChart']
export const Checkbox: typeof import("../components/ui/checkbox/index")['Checkbox']
export const Collapsible: typeof import("../components/ui/collapsible/index")['Collapsible']
export const CollapsibleContent: typeof import("../components/ui/collapsible/index")['CollapsibleContent']
export const CollapsibleTrigger: typeof import("../components/ui/collapsible/index")['CollapsibleTrigger']
export const Command: typeof import("../components/ui/command/index")['Command']
export const CommandDialog: typeof import("../components/ui/command/index")['CommandDialog']
export const CommandEmpty: typeof import("../components/ui/command/index")['CommandEmpty']
export const CommandGroup: typeof import("../components/ui/command/index")['CommandGroup']
export const CommandInput: typeof import("../components/ui/command/index")['CommandInput']
export const CommandItem: typeof import("../components/ui/command/index")['CommandItem']
export const CommandList: typeof import("../components/ui/command/index")['CommandList']
export const CommandSeparator: typeof import("../components/ui/command/index")['CommandSeparator']
export const CommandShortcut: typeof import("../components/ui/command/index")['CommandShortcut']
export const ContextMenu: typeof import("../components/ui/context-menu/index")['ContextMenu']
export const ContextMenuCheckboxItem: typeof import("../components/ui/context-menu/index")['ContextMenuCheckboxItem']
export const ContextMenuContent: typeof import("../components/ui/context-menu/index")['ContextMenuContent']
export const ContextMenuGroup: typeof import("../components/ui/context-menu/index")['ContextMenuGroup']
export const ContextMenuItem: typeof import("../components/ui/context-menu/index")['ContextMenuItem']
export const ContextMenuLabel: typeof import("../components/ui/context-menu/index")['ContextMenuLabel']
export const ContextMenuRadioGroup: typeof import("../components/ui/context-menu/index")['ContextMenuRadioGroup']
export const ContextMenuRadioItem: typeof import("../components/ui/context-menu/index")['ContextMenuRadioItem']
export const ContextMenuSeparator: typeof import("../components/ui/context-menu/index")['ContextMenuSeparator']
export const ContextMenuShortcut: typeof import("../components/ui/context-menu/index")['ContextMenuShortcut']
export const ContextMenuSub: typeof import("../components/ui/context-menu/index")['ContextMenuSub']
export const ContextMenuSubContent: typeof import("../components/ui/context-menu/index")['ContextMenuSubContent']
export const ContextMenuSubTrigger: typeof import("../components/ui/context-menu/index")['ContextMenuSubTrigger']
export const ContextMenuTrigger: typeof import("../components/ui/context-menu/index")['ContextMenuTrigger']
export const Dialog: typeof import("../components/ui/dialog/index")['Dialog']
export const DialogClose: typeof import("../components/ui/dialog/index")['DialogClose']
export const DialogContent: typeof import("../components/ui/dialog/index")['DialogContent']
export const DialogDescription: typeof import("../components/ui/dialog/index")['DialogDescription']
export const DialogFooter: typeof import("../components/ui/dialog/index")['DialogFooter']
export const DialogHeader: typeof import("../components/ui/dialog/index")['DialogHeader']
export const DialogScrollContent: typeof import("../components/ui/dialog/index")['DialogScrollContent']
export const DialogTitle: typeof import("../components/ui/dialog/index")['DialogTitle']
export const DialogTrigger: typeof import("../components/ui/dialog/index")['DialogTrigger']
export const Drawer: typeof import("../components/ui/drawer/index")['Drawer']
export const DrawerContent: typeof import("../components/ui/drawer/index")['DrawerContent']
export const DrawerDescription: typeof import("../components/ui/drawer/index")['DrawerDescription']
export const DrawerFooter: typeof import("../components/ui/drawer/index")['DrawerFooter']
export const DrawerHeader: typeof import("../components/ui/drawer/index")['DrawerHeader']
export const DrawerOverlay: typeof import("../components/ui/drawer/index")['DrawerOverlay']
export const DrawerTitle: typeof import("../components/ui/drawer/index")['DrawerTitle']
export const DrawerClose: typeof import("../components/ui/drawer/index")['DrawerClose']
export const DrawerPortal: typeof import("../components/ui/drawer/index")['DrawerPortal']
export const DrawerTrigger: typeof import("../components/ui/drawer/index")['DrawerTrigger']
export const DropdownMenu: typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']
export const DropdownMenuCheckboxItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']
export const DropdownMenuContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']
export const DropdownMenuGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']
export const DropdownMenuItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']
export const DropdownMenuLabel: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']
export const DropdownMenuRadioGroup: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']
export const DropdownMenuRadioItem: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']
export const DropdownMenuSeparator: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']
export const DropdownMenuShortcut: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']
export const DropdownMenuSub: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']
export const DropdownMenuSubContent: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']
export const DropdownMenuSubTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']
export const DropdownMenuTrigger: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']
export const DropdownMenuPortal: typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']
export const FormControl: typeof import("../components/ui/form/index")['FormControl']
export const FormDescription: typeof import("../components/ui/form/index")['FormDescription']
export const FormItem: typeof import("../components/ui/form/index")['FormItem']
export const FormLabel: typeof import("../components/ui/form/index")['FormLabel']
export const FormMessage: typeof import("../components/ui/form/index")['FormMessage']
export const FORMITEMINJECTIONKEY: typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']
export const Form: typeof import("../components/ui/form/index")['Form']
export const FormField: typeof import("../components/ui/form/index")['FormField']
export const FormFieldArray: typeof import("../components/ui/form/index")['FormFieldArray']
export const HoverCard: typeof import("../components/ui/hover-card/index")['HoverCard']
export const HoverCardContent: typeof import("../components/ui/hover-card/index")['HoverCardContent']
export const HoverCardTrigger: typeof import("../components/ui/hover-card/index")['HoverCardTrigger']
export const Input: typeof import("../components/ui/input/index")['Input']
export const Label: typeof import("../components/ui/label/index")['Label']
export const Menubar: typeof import("../components/ui/menubar/index")['Menubar']
export const MenubarCheckboxItem: typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']
export const MenubarContent: typeof import("../components/ui/menubar/index")['MenubarContent']
export const MenubarGroup: typeof import("../components/ui/menubar/index")['MenubarGroup']
export const MenubarItem: typeof import("../components/ui/menubar/index")['MenubarItem']
export const MenubarLabel: typeof import("../components/ui/menubar/index")['MenubarLabel']
export const MenubarMenu: typeof import("../components/ui/menubar/index")['MenubarMenu']
export const MenubarRadioGroup: typeof import("../components/ui/menubar/index")['MenubarRadioGroup']
export const MenubarRadioItem: typeof import("../components/ui/menubar/index")['MenubarRadioItem']
export const MenubarSeparator: typeof import("../components/ui/menubar/index")['MenubarSeparator']
export const MenubarShortcut: typeof import("../components/ui/menubar/index")['MenubarShortcut']
export const MenubarSub: typeof import("../components/ui/menubar/index")['MenubarSub']
export const MenubarSubContent: typeof import("../components/ui/menubar/index")['MenubarSubContent']
export const MenubarSubTrigger: typeof import("../components/ui/menubar/index")['MenubarSubTrigger']
export const MenubarTrigger: typeof import("../components/ui/menubar/index")['MenubarTrigger']
export const NavigationMenu: typeof import("../components/ui/navigation-menu/index")['NavigationMenu']
export const NavigationMenuContent: typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']
export const NavigationMenuItem: typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']
export const NavigationMenuLink: typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']
export const NavigationMenuList: typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']
export const NavigationMenuTrigger: typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']
export const NumberField: typeof import("../components/ui/number-field/index")['NumberField']
export const NumberFieldContent: typeof import("../components/ui/number-field/index")['NumberFieldContent']
export const NumberFieldDecrement: typeof import("../components/ui/number-field/index")['NumberFieldDecrement']
export const NumberFieldIncrement: typeof import("../components/ui/number-field/index")['NumberFieldIncrement']
export const NumberFieldInput: typeof import("../components/ui/number-field/index")['NumberFieldInput']
export const PaginationEllipsis: typeof import("../components/ui/pagination/index")['PaginationEllipsis']
export const PaginationFirst: typeof import("../components/ui/pagination/index")['PaginationFirst']
export const PaginationLast: typeof import("../components/ui/pagination/index")['PaginationLast']
export const PaginationNext: typeof import("../components/ui/pagination/index")['PaginationNext']
export const PaginationPrev: typeof import("../components/ui/pagination/index")['PaginationPrev']
export const Pagination: typeof import("../components/ui/pagination/index")['Pagination']
export const PaginationList: typeof import("../components/ui/pagination/index")['PaginationList']
export const PaginationListItem: typeof import("../components/ui/pagination/index")['PaginationListItem']
export const PinInput: typeof import("../components/ui/pin-input/index")['PinInput']
export const PinInputGroup: typeof import("../components/ui/pin-input/index")['PinInputGroup']
export const PinInputInput: typeof import("../components/ui/pin-input/index")['PinInputInput']
export const PinInputSeparator: typeof import("../components/ui/pin-input/index")['PinInputSeparator']
export const Popover: typeof import("../components/ui/popover/index")['Popover']
export const PopoverContent: typeof import("../components/ui/popover/index")['PopoverContent']
export const PopoverTrigger: typeof import("../components/ui/popover/index")['PopoverTrigger']
export const Progress: typeof import("../components/ui/progress/index")['Progress']
export const RadioGroup: typeof import("../components/ui/radio-group/index")['RadioGroup']
export const RadioGroupItem: typeof import("../components/ui/radio-group/index")['RadioGroupItem']
export const RangeCalendar: typeof import("../components/ui/range-calendar/index")['RangeCalendar']
export const RangeCalendarCell: typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']
export const RangeCalendarCellTrigger: typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']
export const RangeCalendarGrid: typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']
export const RangeCalendarGridBody: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']
export const RangeCalendarGridHead: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']
export const RangeCalendarGridRow: typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']
export const RangeCalendarHeadCell: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']
export const RangeCalendarHeader: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']
export const RangeCalendarHeading: typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']
export const RangeCalendarNextButton: typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']
export const RangeCalendarPrevButton: typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']
export const ResizableHandle: typeof import("../components/ui/resizable/index")['ResizableHandle']
export const ResizablePanelGroup: typeof import("../components/ui/resizable/index")['ResizablePanelGroup']
export const ResizablePanel: typeof import("../components/ui/resizable/index")['ResizablePanel']
export const ScrollArea: typeof import("../components/ui/scroll-area/index")['ScrollArea']
export const ScrollBar: typeof import("../components/ui/scroll-area/index")['ScrollBar']
export const Select: typeof import("../components/ui/select/index")['Select']
export const SelectContent: typeof import("../components/ui/select/index")['SelectContent']
export const SelectGroup: typeof import("../components/ui/select/index")['SelectGroup']
export const SelectItem: typeof import("../components/ui/select/index")['SelectItem']
export const SelectItemText: typeof import("../components/ui/select/index")['SelectItemText']
export const SelectLabel: typeof import("../components/ui/select/index")['SelectLabel']
export const SelectScrollDownButton: typeof import("../components/ui/select/index")['SelectScrollDownButton']
export const SelectScrollUpButton: typeof import("../components/ui/select/index")['SelectScrollUpButton']
export const SelectSeparator: typeof import("../components/ui/select/index")['SelectSeparator']
export const SelectTrigger: typeof import("../components/ui/select/index")['SelectTrigger']
export const SelectValue: typeof import("../components/ui/select/index")['SelectValue']
export const Separator: typeof import("../components/ui/separator/index")['Separator']
export const Sheet: typeof import("../components/ui/sheet/index")['Sheet']
export const SheetClose: typeof import("../components/ui/sheet/index")['SheetClose']
export const SheetContent: typeof import("../components/ui/sheet/index")['SheetContent']
export const SheetDescription: typeof import("../components/ui/sheet/index")['SheetDescription']
export const SheetFooter: typeof import("../components/ui/sheet/index")['SheetFooter']
export const SheetHeader: typeof import("../components/ui/sheet/index")['SheetHeader']
export const SheetTitle: typeof import("../components/ui/sheet/index")['SheetTitle']
export const SheetTrigger: typeof import("../components/ui/sheet/index")['SheetTrigger']
export const Sidebar: typeof import("../components/ui/sidebar/index")['Sidebar']
export const SidebarContent: typeof import("../components/ui/sidebar/index")['SidebarContent']
export const SidebarFooter: typeof import("../components/ui/sidebar/index")['SidebarFooter']
export const SidebarGroup: typeof import("../components/ui/sidebar/index")['SidebarGroup']
export const SidebarGroupAction: typeof import("../components/ui/sidebar/index")['SidebarGroupAction']
export const SidebarGroupContent: typeof import("../components/ui/sidebar/index")['SidebarGroupContent']
export const SidebarGroupLabel: typeof import("../components/ui/sidebar/index")['SidebarGroupLabel']
export const SidebarHeader: typeof import("../components/ui/sidebar/index")['SidebarHeader']
export const SidebarInput: typeof import("../components/ui/sidebar/index")['SidebarInput']
export const SidebarInset: typeof import("../components/ui/sidebar/index")['SidebarInset']
export const SidebarMenu: typeof import("../components/ui/sidebar/index")['SidebarMenu']
export const SidebarMenuAction: typeof import("../components/ui/sidebar/index")['SidebarMenuAction']
export const SidebarMenuBadge: typeof import("../components/ui/sidebar/index")['SidebarMenuBadge']
export const SidebarMenuButton: typeof import("../components/ui/sidebar/index")['SidebarMenuButton']
export const SidebarMenuItem: typeof import("../components/ui/sidebar/index")['SidebarMenuItem']
export const SidebarMenuSkeleton: typeof import("../components/ui/sidebar/index")['SidebarMenuSkeleton']
export const SidebarMenuSub: typeof import("../components/ui/sidebar/index")['SidebarMenuSub']
export const SidebarMenuSubButton: typeof import("../components/ui/sidebar/index")['SidebarMenuSubButton']
export const SidebarMenuSubItem: typeof import("../components/ui/sidebar/index")['SidebarMenuSubItem']
export const SidebarProvider: typeof import("../components/ui/sidebar/index")['SidebarProvider']
export const SidebarRail: typeof import("../components/ui/sidebar/index")['SidebarRail']
export const SidebarSeparator: typeof import("../components/ui/sidebar/index")['SidebarSeparator']
export const SidebarTrigger: typeof import("../components/ui/sidebar/index")['SidebarTrigger']
export const Skeleton: typeof import("../components/ui/skeleton/index")['Skeleton']
export const Slider: typeof import("../components/ui/slider/index")['Slider']
export const Sonner: typeof import("../components/ui/sonner/index")['Sonner']
export const Stepper: typeof import("../components/ui/stepper/index")['Stepper']
export const StepperDescription: typeof import("../components/ui/stepper/index")['StepperDescription']
export const StepperIndicator: typeof import("../components/ui/stepper/index")['StepperIndicator']
export const StepperItem: typeof import("../components/ui/stepper/index")['StepperItem']
export const StepperSeparator: typeof import("../components/ui/stepper/index")['StepperSeparator']
export const StepperTitle: typeof import("../components/ui/stepper/index")['StepperTitle']
export const StepperTrigger: typeof import("../components/ui/stepper/index")['StepperTrigger']
export const Switch: typeof import("../components/ui/switch/index")['Switch']
export const Table: typeof import("../components/ui/table/index")['Table']
export const TableBody: typeof import("../components/ui/table/index")['TableBody']
export const TableCaption: typeof import("../components/ui/table/index")['TableCaption']
export const TableCell: typeof import("../components/ui/table/index")['TableCell']
export const TableEmpty: typeof import("../components/ui/table/index")['TableEmpty']
export const TableHead: typeof import("../components/ui/table/index")['TableHead']
export const TableHeader: typeof import("../components/ui/table/index")['TableHeader']
export const TableRow: typeof import("../components/ui/table/index")['TableRow']
export const Tabs: typeof import("../components/ui/tabs/index")['Tabs']
export const TabsContent: typeof import("../components/ui/tabs/index")['TabsContent']
export const TabsList: typeof import("../components/ui/tabs/index")['TabsList']
export const TabsTrigger: typeof import("../components/ui/tabs/index")['TabsTrigger']
export const TagsInput: typeof import("../components/ui/tags-input/index")['TagsInput']
export const TagsInputInput: typeof import("../components/ui/tags-input/index")['TagsInputInput']
export const TagsInputItem: typeof import("../components/ui/tags-input/index")['TagsInputItem']
export const TagsInputItemDelete: typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']
export const TagsInputItemText: typeof import("../components/ui/tags-input/index")['TagsInputItemText']
export const Textarea: typeof import("../components/ui/textarea/index")['Textarea']
export const Toast: typeof import("../components/ui/toast/index")['Toast']
export const ToastAction: typeof import("../components/ui/toast/index")['ToastAction']
export const ToastClose: typeof import("../components/ui/toast/index")['ToastClose']
export const ToastDescription: typeof import("../components/ui/toast/index")['ToastDescription']
export const Toaster: typeof import("../components/ui/toast/index")['Toaster']
export const ToastProvider: typeof import("../components/ui/toast/index")['ToastProvider']
export const ToastTitle: typeof import("../components/ui/toast/index")['ToastTitle']
export const ToastViewport: typeof import("../components/ui/toast/index")['ToastViewport']
export const Toggle: typeof import("../components/ui/toggle/index")['Toggle']
export const ToggleGroup: typeof import("../components/ui/toggle-group/index")['ToggleGroup']
export const ToggleGroupItem: typeof import("../components/ui/toggle-group/index")['ToggleGroupItem']
export const Tooltip: typeof import("../components/ui/tooltip/index")['Tooltip']
export const TooltipContent: typeof import("../components/ui/tooltip/index")['TooltipContent']
export const TooltipProvider: typeof import("../components/ui/tooltip/index")['TooltipProvider']
export const TooltipTrigger: typeof import("../components/ui/tooltip/index")['TooltipTrigger']
export const Icon: typeof import("../node_modules/.pnpm/@nuxt+icon@1.13.0_magicast@0.3.5_vite@6.3.5_@types+node@22.15.29_jiti@2.4.2_terser@5.40_07a12c5a204f64f5a9aa197bdc64e3c5/node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const ColorScheme: typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyAppSettings: LazyComponent<typeof import("../components/AppSettings.vue")['default']>
export const LazyDarkToggle: LazyComponent<typeof import("../components/DarkToggle.vue")['default']>
export const LazyPasswordInput: LazyComponent<typeof import("../components/PasswordInput.vue")['default']>
export const LazySearch: LazyComponent<typeof import("../components/Search.vue")['default']>
export const LazyThemeCustomize: LazyComponent<typeof import("../components/ThemeCustomize.vue")['default']>
export const LazyAuthForgotPassword: LazyComponent<typeof import("../components/auth/ForgotPassword.vue")['default']>
export const LazyAuthSignIn: LazyComponent<typeof import("../components/auth/SignIn.vue")['default']>
export const LazyAuthSignUp: LazyComponent<typeof import("../components/auth/SignUp.vue")['default']>
export const LazyBaseBreadcrumbCustom: LazyComponent<typeof import("../components/base/BreadcrumbCustom.vue")['default']>
export const LazyBaseDateRangePicker: LazyComponent<typeof import("../components/base/DateRangePicker.vue")['default']>
export const LazyBaseKbd: LazyComponent<typeof import("../components/base/Kbd.vue")['default']>
export const LazyDashboardOverview: LazyComponent<typeof import("../components/dashboard/Overview.vue")['default']>
export const LazyLayoutAppSidebar: LazyComponent<typeof import("../components/layout/AppSidebar.vue")['default']>
export const LazyLayoutAuth: LazyComponent<typeof import("../components/layout/Auth.vue")['default']>
export const LazyLayoutHeader: LazyComponent<typeof import("../components/layout/Header.vue")['default']>
export const LazyLayoutSidebarNavFooter: LazyComponent<typeof import("../components/layout/SidebarNavFooter.vue")['default']>
export const LazyLayoutSidebarNavGroup: LazyComponent<typeof import("../components/layout/SidebarNavGroup.vue")['default']>
export const LazyLayoutSidebarNavHeader: LazyComponent<typeof import("../components/layout/SidebarNavHeader.vue")['default']>
export const LazyLayoutSidebarNavLink: LazyComponent<typeof import("../components/layout/SidebarNavLink.vue")['default']>
export const LazyMailAccountSwitcher: LazyComponent<typeof import("../components/mail/AccountSwitcher.vue")['default']>
export const LazyMailDisplay: LazyComponent<typeof import("../components/mail/Display.vue")['default']>
export const LazyMailLayout: LazyComponent<typeof import("../components/mail/Layout.vue")['default']>
export const LazyMailList: LazyComponent<typeof import("../components/mail/List.vue")['default']>
export const LazyMailNav: LazyComponent<typeof import("../components/mail/Nav.vue")['default']>
export const LazyMailDataMails: LazyComponent<typeof import("../components/mail/data/mails")['default']>
export const LazyNavigationMenuDemoItem: LazyComponent<typeof import("../components/navigation-menu/DemoItem.vue")['default']>
export const LazySettingsAccountForm: LazyComponent<typeof import("../components/settings/AccountForm.vue")['default']>
export const LazySettingsAppearanceForm: LazyComponent<typeof import("../components/settings/AppearanceForm.vue")['default']>
export const LazySettingsDisplayForm: LazyComponent<typeof import("../components/settings/DisplayForm.vue")['default']>
export const LazySettingsLayout: LazyComponent<typeof import("../components/settings/Layout.vue")['default']>
export const LazySettingsNotificationsForm: LazyComponent<typeof import("../components/settings/NotificationsForm.vue")['default']>
export const LazySettingsProfileForm: LazyComponent<typeof import("../components/settings/ProfileForm.vue")['default']>
export const LazySettingsSidebarNav: LazyComponent<typeof import("../components/settings/SidebarNav.vue")['default']>
export const LazyTasksComponentsDataTable: LazyComponent<typeof import("../components/tasks/components/DataTable.vue")['default']>
export const LazyTasksComponentsDataTableColumnHeader: LazyComponent<typeof import("../components/tasks/components/DataTableColumnHeader.vue")['default']>
export const LazyTasksComponentsDataTableFacetedFilter: LazyComponent<typeof import("../components/tasks/components/DataTableFacetedFilter.vue")['default']>
export const LazyTasksComponentsDataTablePagination: LazyComponent<typeof import("../components/tasks/components/DataTablePagination.vue")['default']>
export const LazyTasksComponentsDataTableRowActions: LazyComponent<typeof import("../components/tasks/components/DataTableRowActions.vue")['default']>
export const LazyTasksComponentsDataTableToolbar: LazyComponent<typeof import("../components/tasks/components/DataTableToolbar.vue")['default']>
export const LazyTasksComponentsDataTableViewOptions: LazyComponent<typeof import("../components/tasks/components/DataTableViewOptions.vue")['default']>
export const LazyTasksComponentsColumns: LazyComponent<typeof import("../components/tasks/components/columns")['default']>
export const LazyTasksData: LazyComponent<typeof import("../components/tasks/data/data")['default']>
export const LazyTasksDataSchema: LazyComponent<typeof import("../components/tasks/data/schema")['default']>
export const LazyUnoIcon: LazyComponent<typeof import("../node_modules/.pnpm/@unocss+nuxt@66.1.3_magicast@0.3.5_postcss@8.5.4_vite@6.3.5_@types+node@22.15.29_jiti@2_0c8be3520acfeb98a7724820836efdab/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyAccordion: LazyComponent<typeof import("../components/ui/accordion/index")['Accordion']>
export const LazyAccordionContent: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionContent']>
export const LazyAccordionItem: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionItem']>
export const LazyAccordionTrigger: LazyComponent<typeof import("../components/ui/accordion/index")['AccordionTrigger']>
export const LazyAlert: LazyComponent<typeof import("../components/ui/alert/index")['Alert']>
export const LazyAlertDescription: LazyComponent<typeof import("../components/ui/alert/index")['AlertDescription']>
export const LazyAlertTitle: LazyComponent<typeof import("../components/ui/alert/index")['AlertTitle']>
export const LazyAlertDialog: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialog']>
export const LazyAlertDialogAction: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogAction']>
export const LazyAlertDialogCancel: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogCancel']>
export const LazyAlertDialogContent: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogContent']>
export const LazyAlertDialogDescription: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogDescription']>
export const LazyAlertDialogFooter: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogFooter']>
export const LazyAlertDialogHeader: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogHeader']>
export const LazyAlertDialogTitle: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTitle']>
export const LazyAlertDialogTrigger: LazyComponent<typeof import("../components/ui/alert-dialog/index")['AlertDialogTrigger']>
export const LazyAspectRatio: LazyComponent<typeof import("../components/ui/aspect-ratio/index")['AspectRatio']>
export const LazyAvatar: LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
export const LazyAvatarFallback: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
export const LazyAvatarImage: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
export const LazyBadge: LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
export const LazyBreadcrumb: LazyComponent<typeof import("../components/ui/breadcrumb/index")['Breadcrumb']>
export const LazyBreadcrumbEllipsis: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbEllipsis']>
export const LazyBreadcrumbItem: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbItem']>
export const LazyBreadcrumbLink: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbLink']>
export const LazyBreadcrumbList: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbList']>
export const LazyBreadcrumbPage: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbPage']>
export const LazyBreadcrumbSeparator: LazyComponent<typeof import("../components/ui/breadcrumb/index")['BreadcrumbSeparator']>
export const LazyButton: LazyComponent<typeof import("../components/ui/button/index")['Button']>
export const LazyCalendar: LazyComponent<typeof import("../components/ui/calendar/index")['Calendar']>
export const LazyCalendarCell: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCell']>
export const LazyCalendarCellTrigger: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarCellTrigger']>
export const LazyCalendarGrid: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGrid']>
export const LazyCalendarGridBody: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridBody']>
export const LazyCalendarGridHead: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridHead']>
export const LazyCalendarGridRow: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarGridRow']>
export const LazyCalendarHeadCell: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeadCell']>
export const LazyCalendarHeader: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeader']>
export const LazyCalendarHeading: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarHeading']>
export const LazyCalendarNextButton: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarNextButton']>
export const LazyCalendarPrevButton: LazyComponent<typeof import("../components/ui/calendar/index")['CalendarPrevButton']>
export const LazyCard: LazyComponent<typeof import("../components/ui/card/index")['Card']>
export const LazyCardContent: LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
export const LazyCardDescription: LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
export const LazyCardFooter: LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
export const LazyCardHeader: LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
export const LazyCardTitle: LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
export const LazyCarousel: LazyComponent<typeof import("../components/ui/carousel/index")['Carousel']>
export const LazyCarouselContent: LazyComponent<typeof import("../components/ui/carousel/index")['CarouselContent']>
export const LazyCarouselItem: LazyComponent<typeof import("../components/ui/carousel/index")['CarouselItem']>
export const LazyCarouselNext: LazyComponent<typeof import("../components/ui/carousel/index")['CarouselNext']>
export const LazyCarouselPrevious: LazyComponent<typeof import("../components/ui/carousel/index")['CarouselPrevious']>
export const LazyCarouselApi: LazyComponent<typeof import("../components/ui/carousel/index")['CarouselApi']>
export const LazyChartCrosshair: LazyComponent<typeof import("../components/ui/chart/index")['ChartCrosshair']>
export const LazyChartLegend: LazyComponent<typeof import("../components/ui/chart/index")['ChartLegend']>
export const LazyChartSingleTooltip: LazyComponent<typeof import("../components/ui/chart/index")['ChartSingleTooltip']>
export const LazyChartTooltip: LazyComponent<typeof import("../components/ui/chart/index")['ChartTooltip']>
export const LazyAreaChart: LazyComponent<typeof import("../components/ui/chart-area/index")['AreaChart']>
export const LazyBarChart: LazyComponent<typeof import("../components/ui/chart-bar/index")['BarChart']>
export const LazyDonutChart: LazyComponent<typeof import("../components/ui/chart-donut/index")['DonutChart']>
export const LazyLineChart: LazyComponent<typeof import("../components/ui/chart-line/index")['LineChart']>
export const LazyCheckbox: LazyComponent<typeof import("../components/ui/checkbox/index")['Checkbox']>
export const LazyCollapsible: LazyComponent<typeof import("../components/ui/collapsible/index")['Collapsible']>
export const LazyCollapsibleContent: LazyComponent<typeof import("../components/ui/collapsible/index")['CollapsibleContent']>
export const LazyCollapsibleTrigger: LazyComponent<typeof import("../components/ui/collapsible/index")['CollapsibleTrigger']>
export const LazyCommand: LazyComponent<typeof import("../components/ui/command/index")['Command']>
export const LazyCommandDialog: LazyComponent<typeof import("../components/ui/command/index")['CommandDialog']>
export const LazyCommandEmpty: LazyComponent<typeof import("../components/ui/command/index")['CommandEmpty']>
export const LazyCommandGroup: LazyComponent<typeof import("../components/ui/command/index")['CommandGroup']>
export const LazyCommandInput: LazyComponent<typeof import("../components/ui/command/index")['CommandInput']>
export const LazyCommandItem: LazyComponent<typeof import("../components/ui/command/index")['CommandItem']>
export const LazyCommandList: LazyComponent<typeof import("../components/ui/command/index")['CommandList']>
export const LazyCommandSeparator: LazyComponent<typeof import("../components/ui/command/index")['CommandSeparator']>
export const LazyCommandShortcut: LazyComponent<typeof import("../components/ui/command/index")['CommandShortcut']>
export const LazyContextMenu: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenu']>
export const LazyContextMenuCheckboxItem: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuCheckboxItem']>
export const LazyContextMenuContent: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuContent']>
export const LazyContextMenuGroup: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuGroup']>
export const LazyContextMenuItem: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuItem']>
export const LazyContextMenuLabel: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuLabel']>
export const LazyContextMenuRadioGroup: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuRadioGroup']>
export const LazyContextMenuRadioItem: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuRadioItem']>
export const LazyContextMenuSeparator: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSeparator']>
export const LazyContextMenuShortcut: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuShortcut']>
export const LazyContextMenuSub: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSub']>
export const LazyContextMenuSubContent: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSubContent']>
export const LazyContextMenuSubTrigger: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuSubTrigger']>
export const LazyContextMenuTrigger: LazyComponent<typeof import("../components/ui/context-menu/index")['ContextMenuTrigger']>
export const LazyDialog: LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
export const LazyDialogClose: LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
export const LazyDialogContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
export const LazyDialogDescription: LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
export const LazyDialogFooter: LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
export const LazyDialogHeader: LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
export const LazyDialogScrollContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
export const LazyDialogTitle: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
export const LazyDialogTrigger: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
export const LazyDrawer: LazyComponent<typeof import("../components/ui/drawer/index")['Drawer']>
export const LazyDrawerContent: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerContent']>
export const LazyDrawerDescription: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerDescription']>
export const LazyDrawerFooter: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerFooter']>
export const LazyDrawerHeader: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerHeader']>
export const LazyDrawerOverlay: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerOverlay']>
export const LazyDrawerTitle: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerTitle']>
export const LazyDrawerClose: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerClose']>
export const LazyDrawerPortal: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerPortal']>
export const LazyDrawerTrigger: LazyComponent<typeof import("../components/ui/drawer/index")['DrawerTrigger']>
export const LazyDropdownMenu: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenu']>
export const LazyDropdownMenuCheckboxItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuCheckboxItem']>
export const LazyDropdownMenuContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuContent']>
export const LazyDropdownMenuGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuGroup']>
export const LazyDropdownMenuItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuItem']>
export const LazyDropdownMenuLabel: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuLabel']>
export const LazyDropdownMenuRadioGroup: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioGroup']>
export const LazyDropdownMenuRadioItem: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuRadioItem']>
export const LazyDropdownMenuSeparator: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSeparator']>
export const LazyDropdownMenuShortcut: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuShortcut']>
export const LazyDropdownMenuSub: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSub']>
export const LazyDropdownMenuSubContent: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubContent']>
export const LazyDropdownMenuSubTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuSubTrigger']>
export const LazyDropdownMenuTrigger: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuTrigger']>
export const LazyDropdownMenuPortal: LazyComponent<typeof import("../components/ui/dropdown-menu/index")['DropdownMenuPortal']>
export const LazyFormControl: LazyComponent<typeof import("../components/ui/form/index")['FormControl']>
export const LazyFormDescription: LazyComponent<typeof import("../components/ui/form/index")['FormDescription']>
export const LazyFormItem: LazyComponent<typeof import("../components/ui/form/index")['FormItem']>
export const LazyFormLabel: LazyComponent<typeof import("../components/ui/form/index")['FormLabel']>
export const LazyFormMessage: LazyComponent<typeof import("../components/ui/form/index")['FormMessage']>
export const LazyFORMITEMINJECTIONKEY: LazyComponent<typeof import("../components/ui/form/index")['FORM_ITEM_INJECTION_KEY']>
export const LazyForm: LazyComponent<typeof import("../components/ui/form/index")['Form']>
export const LazyFormField: LazyComponent<typeof import("../components/ui/form/index")['FormField']>
export const LazyFormFieldArray: LazyComponent<typeof import("../components/ui/form/index")['FormFieldArray']>
export const LazyHoverCard: LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCard']>
export const LazyHoverCardContent: LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCardContent']>
export const LazyHoverCardTrigger: LazyComponent<typeof import("../components/ui/hover-card/index")['HoverCardTrigger']>
export const LazyInput: LazyComponent<typeof import("../components/ui/input/index")['Input']>
export const LazyLabel: LazyComponent<typeof import("../components/ui/label/index")['Label']>
export const LazyMenubar: LazyComponent<typeof import("../components/ui/menubar/index")['Menubar']>
export const LazyMenubarCheckboxItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarCheckboxItem']>
export const LazyMenubarContent: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarContent']>
export const LazyMenubarGroup: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarGroup']>
export const LazyMenubarItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarItem']>
export const LazyMenubarLabel: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarLabel']>
export const LazyMenubarMenu: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarMenu']>
export const LazyMenubarRadioGroup: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioGroup']>
export const LazyMenubarRadioItem: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarRadioItem']>
export const LazyMenubarSeparator: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSeparator']>
export const LazyMenubarShortcut: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarShortcut']>
export const LazyMenubarSub: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSub']>
export const LazyMenubarSubContent: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubContent']>
export const LazyMenubarSubTrigger: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarSubTrigger']>
export const LazyMenubarTrigger: LazyComponent<typeof import("../components/ui/menubar/index")['MenubarTrigger']>
export const LazyNavigationMenu: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenu']>
export const LazyNavigationMenuContent: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuContent']>
export const LazyNavigationMenuItem: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuItem']>
export const LazyNavigationMenuLink: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuLink']>
export const LazyNavigationMenuList: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuList']>
export const LazyNavigationMenuTrigger: LazyComponent<typeof import("../components/ui/navigation-menu/index")['NavigationMenuTrigger']>
export const LazyNumberField: LazyComponent<typeof import("../components/ui/number-field/index")['NumberField']>
export const LazyNumberFieldContent: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldContent']>
export const LazyNumberFieldDecrement: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldDecrement']>
export const LazyNumberFieldIncrement: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldIncrement']>
export const LazyNumberFieldInput: LazyComponent<typeof import("../components/ui/number-field/index")['NumberFieldInput']>
export const LazyPaginationEllipsis: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationEllipsis']>
export const LazyPaginationFirst: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationFirst']>
export const LazyPaginationLast: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationLast']>
export const LazyPaginationNext: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationNext']>
export const LazyPaginationPrev: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationPrev']>
export const LazyPagination: LazyComponent<typeof import("../components/ui/pagination/index")['Pagination']>
export const LazyPaginationList: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationList']>
export const LazyPaginationListItem: LazyComponent<typeof import("../components/ui/pagination/index")['PaginationListItem']>
export const LazyPinInput: LazyComponent<typeof import("../components/ui/pin-input/index")['PinInput']>
export const LazyPinInputGroup: LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputGroup']>
export const LazyPinInputInput: LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputInput']>
export const LazyPinInputSeparator: LazyComponent<typeof import("../components/ui/pin-input/index")['PinInputSeparator']>
export const LazyPopover: LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
export const LazyPopoverContent: LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
export const LazyPopoverTrigger: LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
export const LazyProgress: LazyComponent<typeof import("../components/ui/progress/index")['Progress']>
export const LazyRadioGroup: LazyComponent<typeof import("../components/ui/radio-group/index")['RadioGroup']>
export const LazyRadioGroupItem: LazyComponent<typeof import("../components/ui/radio-group/index")['RadioGroupItem']>
export const LazyRangeCalendar: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendar']>
export const LazyRangeCalendarCell: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCell']>
export const LazyRangeCalendarCellTrigger: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarCellTrigger']>
export const LazyRangeCalendarGrid: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGrid']>
export const LazyRangeCalendarGridBody: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridBody']>
export const LazyRangeCalendarGridHead: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridHead']>
export const LazyRangeCalendarGridRow: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarGridRow']>
export const LazyRangeCalendarHeadCell: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeadCell']>
export const LazyRangeCalendarHeader: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeader']>
export const LazyRangeCalendarHeading: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarHeading']>
export const LazyRangeCalendarNextButton: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarNextButton']>
export const LazyRangeCalendarPrevButton: LazyComponent<typeof import("../components/ui/range-calendar/index")['RangeCalendarPrevButton']>
export const LazyResizableHandle: LazyComponent<typeof import("../components/ui/resizable/index")['ResizableHandle']>
export const LazyResizablePanelGroup: LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanelGroup']>
export const LazyResizablePanel: LazyComponent<typeof import("../components/ui/resizable/index")['ResizablePanel']>
export const LazyScrollArea: LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollArea']>
export const LazyScrollBar: LazyComponent<typeof import("../components/ui/scroll-area/index")['ScrollBar']>
export const LazySelect: LazyComponent<typeof import("../components/ui/select/index")['Select']>
export const LazySelectContent: LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
export const LazySelectGroup: LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
export const LazySelectItem: LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
export const LazySelectItemText: LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
export const LazySelectLabel: LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
export const LazySelectScrollDownButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
export const LazySelectScrollUpButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
export const LazySelectSeparator: LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
export const LazySelectTrigger: LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
export const LazySelectValue: LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
export const LazySeparator: LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
export const LazySheet: LazyComponent<typeof import("../components/ui/sheet/index")['Sheet']>
export const LazySheetClose: LazyComponent<typeof import("../components/ui/sheet/index")['SheetClose']>
export const LazySheetContent: LazyComponent<typeof import("../components/ui/sheet/index")['SheetContent']>
export const LazySheetDescription: LazyComponent<typeof import("../components/ui/sheet/index")['SheetDescription']>
export const LazySheetFooter: LazyComponent<typeof import("../components/ui/sheet/index")['SheetFooter']>
export const LazySheetHeader: LazyComponent<typeof import("../components/ui/sheet/index")['SheetHeader']>
export const LazySheetTitle: LazyComponent<typeof import("../components/ui/sheet/index")['SheetTitle']>
export const LazySheetTrigger: LazyComponent<typeof import("../components/ui/sheet/index")['SheetTrigger']>
export const LazySidebar: LazyComponent<typeof import("../components/ui/sidebar/index")['Sidebar']>
export const LazySidebarContent: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarContent']>
export const LazySidebarFooter: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarFooter']>
export const LazySidebarGroup: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroup']>
export const LazySidebarGroupAction: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupAction']>
export const LazySidebarGroupContent: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupContent']>
export const LazySidebarGroupLabel: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarGroupLabel']>
export const LazySidebarHeader: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarHeader']>
export const LazySidebarInput: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarInput']>
export const LazySidebarInset: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarInset']>
export const LazySidebarMenu: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenu']>
export const LazySidebarMenuAction: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuAction']>
export const LazySidebarMenuBadge: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuBadge']>
export const LazySidebarMenuButton: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuButton']>
export const LazySidebarMenuItem: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuItem']>
export const LazySidebarMenuSkeleton: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSkeleton']>
export const LazySidebarMenuSub: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSub']>
export const LazySidebarMenuSubButton: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSubButton']>
export const LazySidebarMenuSubItem: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarMenuSubItem']>
export const LazySidebarProvider: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarProvider']>
export const LazySidebarRail: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarRail']>
export const LazySidebarSeparator: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarSeparator']>
export const LazySidebarTrigger: LazyComponent<typeof import("../components/ui/sidebar/index")['SidebarTrigger']>
export const LazySkeleton: LazyComponent<typeof import("../components/ui/skeleton/index")['Skeleton']>
export const LazySlider: LazyComponent<typeof import("../components/ui/slider/index")['Slider']>
export const LazySonner: LazyComponent<typeof import("../components/ui/sonner/index")['Sonner']>
export const LazyStepper: LazyComponent<typeof import("../components/ui/stepper/index")['Stepper']>
export const LazyStepperDescription: LazyComponent<typeof import("../components/ui/stepper/index")['StepperDescription']>
export const LazyStepperIndicator: LazyComponent<typeof import("../components/ui/stepper/index")['StepperIndicator']>
export const LazyStepperItem: LazyComponent<typeof import("../components/ui/stepper/index")['StepperItem']>
export const LazyStepperSeparator: LazyComponent<typeof import("../components/ui/stepper/index")['StepperSeparator']>
export const LazyStepperTitle: LazyComponent<typeof import("../components/ui/stepper/index")['StepperTitle']>
export const LazyStepperTrigger: LazyComponent<typeof import("../components/ui/stepper/index")['StepperTrigger']>
export const LazySwitch: LazyComponent<typeof import("../components/ui/switch/index")['Switch']>
export const LazyTable: LazyComponent<typeof import("../components/ui/table/index")['Table']>
export const LazyTableBody: LazyComponent<typeof import("../components/ui/table/index")['TableBody']>
export const LazyTableCaption: LazyComponent<typeof import("../components/ui/table/index")['TableCaption']>
export const LazyTableCell: LazyComponent<typeof import("../components/ui/table/index")['TableCell']>
export const LazyTableEmpty: LazyComponent<typeof import("../components/ui/table/index")['TableEmpty']>
export const LazyTableHead: LazyComponent<typeof import("../components/ui/table/index")['TableHead']>
export const LazyTableHeader: LazyComponent<typeof import("../components/ui/table/index")['TableHeader']>
export const LazyTableRow: LazyComponent<typeof import("../components/ui/table/index")['TableRow']>
export const LazyTabs: LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
export const LazyTabsContent: LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
export const LazyTabsList: LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
export const LazyTabsTrigger: LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
export const LazyTagsInput: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInput']>
export const LazyTagsInputInput: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputInput']>
export const LazyTagsInputItem: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItem']>
export const LazyTagsInputItemDelete: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemDelete']>
export const LazyTagsInputItemText: LazyComponent<typeof import("../components/ui/tags-input/index")['TagsInputItemText']>
export const LazyTextarea: LazyComponent<typeof import("../components/ui/textarea/index")['Textarea']>
export const LazyToast: LazyComponent<typeof import("../components/ui/toast/index")['Toast']>
export const LazyToastAction: LazyComponent<typeof import("../components/ui/toast/index")['ToastAction']>
export const LazyToastClose: LazyComponent<typeof import("../components/ui/toast/index")['ToastClose']>
export const LazyToastDescription: LazyComponent<typeof import("../components/ui/toast/index")['ToastDescription']>
export const LazyToaster: LazyComponent<typeof import("../components/ui/toast/index")['Toaster']>
export const LazyToastProvider: LazyComponent<typeof import("../components/ui/toast/index")['ToastProvider']>
export const LazyToastTitle: LazyComponent<typeof import("../components/ui/toast/index")['ToastTitle']>
export const LazyToastViewport: LazyComponent<typeof import("../components/ui/toast/index")['ToastViewport']>
export const LazyToggle: LazyComponent<typeof import("../components/ui/toggle/index")['Toggle']>
export const LazyToggleGroup: LazyComponent<typeof import("../components/ui/toggle-group/index")['ToggleGroup']>
export const LazyToggleGroupItem: LazyComponent<typeof import("../components/ui/toggle-group/index")['ToggleGroupItem']>
export const LazyTooltip: LazyComponent<typeof import("../components/ui/tooltip/index")['Tooltip']>
export const LazyTooltipContent: LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipContent']>
export const LazyTooltipProvider: LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipProvider']>
export const LazyTooltipTrigger: LazyComponent<typeof import("../components/ui/tooltip/index")['TooltipTrigger']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/.pnpm/@nuxt+icon@1.13.0_magicast@0.3.5_vite@6.3.5_@types+node@22.15.29_jiti@2.4.2_terser@5.40_07a12c5a204f64f5a9aa197bdc64e3c5/node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/.pnpm/nuxt@3.17.5_@parcel+watcher@2.5.1_@types+node@22.15.29_db0@0.3.2_eslint@9.28.0_jiti@2.4_c48285d40e6ddafa35203806e38423d3/node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
