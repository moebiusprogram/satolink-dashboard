import { Fade } from "react-awesome-reveal";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  HelpCircleIcon,
  HelpCircleIcon as AlertCircleIcon,
  BookIcon,
  MessageCircleIcon,
  GithubIcon,
  LifeBuoyIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HelpPage() {
  const helpResources = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API documentation for Satolink",
      icon: BookIcon,
      link: "https://satolink.com/api-docs",
      category: "Learn",
      color: "bg-blue-500",
    },
    {
      title: "Community Forum",
      description:
        "Join discussions with other users and share your experiences",
      icon: MessageCircleIcon,
      link: "https://satolink.com/forum/",
      category: "Community",
      color: "bg-green-500",
    },
    {
      title: "GitHub Repository",
      description:
        "Contribute to the project, report issues, and view the source code",
      icon: GithubIcon,
      link: "https://github.com/satolink",
      category: "Development",
      color: "bg-gray-500",
    },
    {
      title: "Wiki",
      description:
        "User-contributed knowledge base with tips and troubleshooting",
      icon: BookIcon,
      link: "https://satolink.com/wiki/index.php?title=Main_Page",
      category: "Learn",
      color: "bg-purple-500",
    },
    {
      title: "IRC Channel",
      description: "Real-time chat with developers and experienced users",
      icon: MessageCircleIcon,
      link: "https://irc.com/?channel=satolink",
      category: "Community",
      color: "bg-indigo-500",
    },
    {
      title: "Support Portal",
      description: "Get direct assistance from our support team",
      icon: LifeBuoyIcon,
      link: "/help",
      category: "Support",
      color: "bg-orange-500",
    },
  ];

  const faqs = [
    {
      question: "How do I recover my account?",
      answer:
        "Visit our support portal and use the account recovery form. You'll need to provide your registered email and complete verification steps.",
    },
    {
      question: "Where can I find API documentation?",
      answer:
        "Our comprehensive API documentation is available in the Documentation section, which includes code examples and integration guides.",
    },
    {
      question: "How do I report a security issue?",
      answer:
        "Please contact our security team directly through the support portal and mark your message as 'Security Issue' for immediate attention.",
    },
    {
      question: "Can I contribute to the project?",
      answer:
        "Absolutely! We welcome contributions. Visit our GitHub repository for contribution guidelines and open issues that need help.",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="">
            <div className="">
              <Card className="@container/card bg-transparent border-none p-6">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircleIcon className="h-6 w-6" />
                    <CardTitle className="font-semibold text-2xl pb-3">
                      Help & Support
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Find resources, documentation, and support channels for
                    Satolink
                  </CardDescription>
                </CardHeader>
                <div className="px-4 pb-6">
                  <Alert className="mb-6">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Need immediate help?</AlertTitle>
                    <AlertDescription>
                      Contact our support team directly through our support
                      portal for urgent issues.
                    </AlertDescription>
                  </Alert>

                  <h3 className="text-xl font-semibold mb-4">Help Resources</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {helpResources.map((resource, index) => (
                      <Card
                        key={index}
                        className="group hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-end">
                            <Badge
                              className={`bg-red-500 text-white float-right`}>
                              {resource.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <div
                              className={`${resource.color} p-2 rounded-md text-white`}>
                              <resource.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {resource.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex flex-col items-start gap-2 pt-0">
                          <CardDescription className="text-sm">
                            {resource.description}
                          </CardDescription>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              window.open(resource.link, "_blank")
                            }>
                            Visit {resource.title}
                            <ExternalLinkIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mt-8 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                            {faq.question}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <CardDescription className="text-sm">
                            {faq.answer}
                          </CardDescription>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Alert>
                      <LifeBuoyIcon className="h-4 w-4" />
                      <AlertTitle>Emergency Support</AlertTitle>
                      <AlertDescription>
                        For critical issues affecting your service, please
                        contact our 24/7 support team at{" "}
                        <a
                          href="mailto:support@satolink.com"
                          className="text-primary hover:underline font-medium">
                          support@satolink.com
                        </a>
                        .
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                <CardFooter className="flex-col items-start gap-1.5 text-sm px-4 pb-4">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Community-powered support
                  </div>
                  <div className="text-muted-foreground">
                    Satolink is supported by an active community and dedicated
                    team
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
