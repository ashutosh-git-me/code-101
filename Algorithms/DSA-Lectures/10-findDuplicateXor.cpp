#include<iostream>
#include<vector>
using namespace std;

int duplicate(int arr[],int size){
    int ans=0;
    //XORing All Elements
    for(int i=0; i<size; i++){
        ans^=arr[i];
    }
    //XORing All Unique Elements
    for(int i=1; i<size; i++){
        ans^=i;
    }
    return ans;
}

int main()
{
    int num;
    cout<<"No. of Arrays: ";
    cin>>num;

    for(int i=1; i<=num; i++){
        int n;
        cout<<"Number of Elements: ";
        cin>>n;
        int array[n];
        for(int j=0; j<n; j++){
            cin>>array[j];
        }
        cout<<duplicate(array, n)<<endl;  
    }
    return 0;
}

